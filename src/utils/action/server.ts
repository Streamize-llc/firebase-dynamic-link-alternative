"use server";

import { createClient } from "@/utils/supabase/server";
import crypto from 'crypto';

export async function getProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  // First try to get the profile
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (error) {
    throw new Error("Error fetching profile");
  }

  // If no profile exists, create one
  if (!profile) {
    const { data: newProfile, error: createError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        user_name: user.email?.split('@')[0] || 'user',
        email: user.email || '',
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`
      })
      .select()
      .single();

    if (createError) {
      throw new Error("Error creating profile: " + createError.message);
    }

    return newProfile;
  }

  return profile;
}

export async function getDeepLinkAdmin(workspaceId: string) {
  const supabase = await createClient();

  const { data: deeplinks, error } = await supabase
    .from('deeplinks')
    .select('*')
    .eq('workspace_id', workspaceId)
    .limit(10);

  if (error) {
    throw new Error("딥링크 조회 중 오류가 발생했습니다: " + error.message);
  }

  return deeplinks;
}

export async function getWorkspaces() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  // 사용자가 소유하거나 멤버로 속한 모든 워크스페이스 가져오기
  const { data: ownedWorkspaces, error: ownedError } = await supabase
    .from('workspaces')
    .select(`
      id,
      name,
      description,
      sub_domain,
      created_at,
      owner_id,
      api_key,
      client_key,
      profiles:owner_id (
        user_name,
        avatar_url
      ),
      apps!workspace_id (
        id,
        name,
        platform,
        platform_data
      )
    `)
    .eq('owner_id', user.id);

  if (ownedError) {
    throw new Error("소유한 워크스페이스 조회 중 오류가 발생했습니다: " + ownedError.message);
  }

  // 사용자가 멤버로 속한 워크스페이스 가져오기 (소유자가 아닌 경우)
  const { data: memberWorkspaces, error: memberError } = await supabase
    .from('workspace_memberships')
    .select(`
      workspace_id,
      role,
      status,
      workspaces:workspace_id (
        id,
        name,
        description,
        sub_domain,
        created_at,
        owner_id,
        profiles:owner_id (
          user_name,
          avatar_url
        ),
        apps!workspace_id (
          id,
          name,
          platform,
          platform_data
        )
      )
    `)
    .eq('user_id', user.id)
    .eq('status', 'ACCEPTED')
    .neq('role', 'OWNER');

  if (memberError) {
    throw new Error("멤버로 속한 워크스페이스 조회 중 오류가 발생했습니다: " + memberError.message);
  }

  // 멤버 워크스페이스 데이터 형식 변환
  const formattedMemberWorkspaces = memberWorkspaces
    .filter(item => item.workspaces) // null 체크
    .map(item => item.workspaces);

  // 두 결과 합치기
  return [...ownedWorkspaces, ...formattedMemberWorkspaces];
}

export async function getWorkspace(workspaceId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("인증된 사용자가 아닙니다");
  }

  // 워크스페이스 정보 가져오기
  const { data: workspace, error: workspaceError } = await supabase
    .from('workspaces')
    .select(`
      id,
      name,
      description,
      api_key,
      client_key,
      sub_domain,
      created_at,
      owner_id,
      subscription_tier,
      current_monthly_create_count,
      current_monthly_click_count,
      profiles:owner_id (
        user_name,
        avatar_url
      )
    `)
    .eq('id', workspaceId)
    .single();

  if (workspaceError) {
    throw new Error("워크스페이스 정보 조회 중 오류가 발생했습니다: " + workspaceError.message);
  }

  if (!workspace) {
    throw new Error("워크스페이스를 찾을 수 없습니다");
  }

  // 사용자가 이 워크스페이스에 접근할 권한이 있는지 확인
  const { data: membership, error: membershipError } = await supabase
    .from('workspace_memberships')
    .select('role, status')
    .eq('workspace_id', workspaceId)
    .eq('user_id', user.id)
    .single();

  if (membershipError && membershipError.code !== 'PGRST116') { // PGRST116: 결과가 없음
    throw new Error("워크스페이스 접근 권한 확인 중 오류가 발생했습니다: " + membershipError.message);
  }

  // 워크스페이스 소유자가 아니고, 멤버십이 없거나 승인되지 않은 경우 접근 거부
  if (workspace.owner_id !== user.id && (!membership || membership.status !== 'ACCEPTED')) {
    throw new Error("이 워크스페이스에 접근할 권한이 없습니다");
  }

  // 워크스페이스에 연결된 앱 정보 가져오기
  const { data: apps, error: appsError } = await supabase
    .from('apps')
    .select('*')
    .eq('workspace_id', workspaceId);

  if (appsError) {
    throw new Error("앱 정보 조회 중 오류가 발생했습니다: " + appsError.message);
  }

  // 플랫폼 정보 추가
  const platforms = apps ? apps.map(app => app.platform) : [];

  return {
    ...workspace,
    platforms,
    apps
  };
}

export async function updateWorkspaceSubDomain(workspaceId: string, subDomain: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  // 서브도메인 중복 확인
  const { data: existingDomain, error: checkError } = await supabase
    .from('workspaces')
    .select('id')
    .eq('sub_domain', subDomain)
    .neq('id', workspaceId)
    .maybeSingle();

  // checkError가 있고, 단순히 데이터가 없는 것이 아닌 경우에만 에러 처리
  if (checkError && checkError.code !== 'PGRST116') {
    throw new Error("서브도메인 확인 중 오류가 발생했습니다: " + checkError.message);
  }

  if (existingDomain) {
    throw new Error("이미 사용 중인 서브도메인입니다. 다른 서브도메인을 선택해주세요.");
  }

  const { data: workspace, error: workspaceError } = await supabase
    .from('workspaces')
    .update({ sub_domain: subDomain })
    .eq('id', workspaceId)
    .select()
    .single();

  if (workspaceError) {
    throw new Error("워크스페이스 도메인 업데이트 중 오류가 발생했습니다: " + workspaceError.message);
  }

  return workspace;
}

export async function createWorkspace(name: string, subDomain: string, description?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  // 워크스페이스 생성 및 소유자 정보 저장
  const { data: workspace, error: workspaceError } = await supabase
    .from('workspaces')
    .insert({
      name,
      description,
      sub_domain: subDomain,
      owner_id: user.id,
      subscription_tier: 'free',
      next_quota_update_at: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
      api_key: crypto.randomUUID(),
      client_key: crypto.randomUUID()
    })
    .select()
    .single();

  if (workspaceError) {
    throw new Error("워크스페이스 생성 중 오류가 발생했습니다: " + workspaceError.message);
  }

  // 워크스페이스 멤버십 생성 (소유자를 멤버로 추가)
  const { error: membershipError } = await supabase
    .from('workspace_memberships')
    .insert({
      workspace_id: workspace.id,
      user_id: user.id,
      invited_by: user.id,
      role: 'OWNER',
      status: 'ACCEPTED',
      accepted_at: new Date().toISOString()
    });

  if (membershipError) {
    throw new Error("워크스페이스 멤버십 생성 중 오류가 발생했습니다: " + membershipError.message);
  }

  return workspace;
}

export async function createApp(workspaceId: string, platform: 'IOS' | 'ANDROID', platformData: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  // 워크스페이스에 해당 플랫폼의 앱이 이미 존재하는지 확인
  const { data: existingApp, error: fetchError } = await supabase
    .from('apps')
    .select('*')
    .eq('workspace_id', workspaceId)
    .eq('platform', platform)
    .maybeSingle();

  if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116는 결과가 없을 때 발생하는 에러 코드
    throw new Error("앱 정보 조회 중 오류가 발생했습니다: " + fetchError.message);
  }

  // 앱 이름 설정
  const appName = platform === 'IOS' ? 'iOS 앱' : '안드로이드 앱';

  // 플랫폼 데이터 유효성 검사
  if (platform === 'IOS' && (!platformData.bundle_id || !platformData.team_id || !platformData.app_id)) {
    throw new Error("iOS 앱 등록을 위해 bundleId, teamId, appId가 필요합니다.");
  } else if (platform === 'ANDROID' && (!platformData.package_name || !platformData.sha256_list)) {
    throw new Error("안드로이드 앱 등록을 위해 packageName과 sha256_list가 필요합니다.");
  }

  if (existingApp) {
    // 기존 앱 업데이트
    const { data: updatedApp, error: updateError } = await supabase
      .from('apps')
      .update({
        platform_data: platformData
      })
      .eq('id', existingApp.id)
      .select()
      .single();

    if (updateError) {
      throw new Error("앱 업데이트 중 오류가 발생했습니다: " + updateError.message);
    }

    return updatedApp;
  } else {
    // 새 앱 생성
    const { data: newApp, error: insertError } = await supabase
      .from('apps')
      .insert({
        workspace_id: workspaceId,
        platform: platform,
        name: appName,
        platform_data: platformData
      })
      .select()
      .single();

    if (insertError) {
      throw new Error("앱 생성 중 오류가 발생했습니다: " + insertError.message);
    }

    return newApp;
  }
}

// 모든 워크스페이스의 딥링크 가져오기
export async function getAllDeeplinks() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  // 사용자의 모든 워크스페이스 ID 가져오기
  const workspaces = await getWorkspaces();
  const workspaceIds = workspaces.map((w: any) => w.id);

  if (workspaceIds.length === 0) {
    return [];
  }

  // 모든 워크스페이스의 딥링크 가져오기
  const { data: deeplinks, error } = await supabase
    .from('deeplinks')
    .select(`
      *,
      workspaces:workspace_id (
        id,
        name,
        sub_domain
      )
    `)
    .in('workspace_id', workspaceIds)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error("딥링크 조회 중 오류가 발생했습니다: " + error.message);
  }

  return deeplinks;
}

// 워크스페이스별 딥링크 가져오기
export async function getWorkspaceDeeplinks(workspaceId: string, source?: 'UI' | 'API', limit?: number) {
  const supabase = await createClient();

  let query = supabase
    .from('deeplinks')
    .select(`
      *,
      workspaces:workspace_id (
        id,
        name,
        sub_domain
      )
    `)
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false });

  // source 필터 적용
  if (source) {
    query = query.eq('source', source);
  }

  // limit 적용
  if (limit) {
    query = query.limit(limit);
  }

  const { data: deeplinks, error } = await query;

  if (error) {
    throw new Error("딥링크 조회 중 오류가 발생했습니다: " + error.message);
  }

  return deeplinks;
}

// 워크스페이스 통계
export async function getWorkspaceStats(workspaceId: string) {
  const supabase = await createClient();

  const { data: deeplinks, error } = await supabase
    .from('deeplinks')
    .select('click_count, created_at')
    .eq('workspace_id', workspaceId);

  if (error) {
    throw new Error("통계 조회 중 오류가 발생했습니다: " + error.message);
  }

  const totalClicks = deeplinks.reduce((sum, link) => sum + link.click_count, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const clicksToday = deeplinks
    .filter(link => new Date(link.created_at) >= today)
    .reduce((sum, link) => sum + link.click_count, 0);

  return {
    totalLinks: deeplinks.length,
    totalClicks,
    clicksToday,
    avgPerLink: deeplinks.length ? Math.round(totalClicks / deeplinks.length) : 0
  };
}

// 딥링크 생성 (UI에서 사용)
export async function createDeeplink(
  workspaceId: string,
  data: {
    slug: string;
    app_params: any;
    ios_parameters?: any;
    android_parameters?: any;
    social_meta?: {
      title?: string;
      description?: string;
      thumbnail_url?: string;
    };
  }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  // 워크스페이스 권한 확인
  const workspace = await getWorkspace(workspaceId);
  if (!workspace) {
    throw new Error("워크스페이스를 찾을 수 없습니다");
  }

  // 소셜 메타 기본값 설정
  const socialMeta = {
    title: data.social_meta?.title || "Depl.link | App Download",
    description: data.social_meta?.description || "Download the mobile app for a better experience.",
    thumbnail_url: data.social_meta?.thumbnail_url || "/images/og-image.jpg"
  };

  // 딥링크 생성
  const { data: deeplink, error } = await supabase
    .from('deeplinks')
    .insert({
      workspace_id: workspaceId,
      slug: data.slug,
      is_random_slug: false,  // UI에서는 항상 사용자가 slug 지정
      app_params: data.app_params,
      ios_parameters: data.ios_parameters || {},
      android_parameters: data.android_parameters || {},
      social_meta: socialMeta,
      source: 'UI',
    })
    .select()
    .single();

  if (error) {
    throw new Error("딥링크 생성 중 오류가 발생했습니다: " + error.message);
  }

  return deeplink;
}

// 딥링크 클릭 추적
export async function incrementDeeplinkClick(workspaceId: string, slug: string) {
  const supabase = await createClient();

  try {
    // 딥링크 클릭 수 증가
    const { error: clickError } = await supabase.rpc('increment_click_count', {
      p_workspace_id: workspaceId,
      p_slug: slug
    });

    if (clickError) {
      console.error('딥링크 클릭 수 증가 실패:', { workspaceId, slug, error: clickError });
    }

    // 워크스페이스 월별 클릭 수 증가
    const { error: workspaceError } = await supabase.rpc('increment_workspace_click', {
      p_workspace_id: workspaceId
    });

    if (workspaceError) {
      console.error('워크스페이스 클릭 수 증가 실패:', { workspaceId, error: workspaceError });
    }
  } catch (error) {
    console.error('클릭 추적 중 예외 발생:', { workspaceId, slug, error });
    // 에러를 던지지 않음 - 클릭 추적 실패가 사용자 경험을 방해하면 안 됨
  }
}

// "use server";

// import { createClient } from "@/utils/supabase/server";
// import { revalidatePath } from "next/cache";
// import { NextResponse } from "next/server";
// import { Task } from "@/types/processors";
// import { 
//   type NewUsageRecord,
//   type UsageRecord,
//   lemonSqueezySetup,
//   createCheckout, 
//   createUsageRecord,
//   NewWebhook,
//   cancelSubscription as lsCancelSubscription
// } from "@lemonsqueezy/lemonsqueezy.js";

// lemonSqueezySetup({ apiKey: process.env.LEMONSQUEEZY_API_KEY })

// async function incrementUsage(subscriptionItemId: number, quantity: number) {
//   const usageRecord: NewUsageRecord = {
//     action: 'increment',
//     subscriptionItemId,
//     quantity
//   }
//   const { error } = await createUsageRecord(usageRecord);
//   if (error) {
//     console.error("Error creating usage record:", error);
//   }
// }

// export async function cancelSubscription() {
//   const supabase = createClient();
//   const { data: { user } } = await supabase.auth.getUser();
//   if (!user) {
//     throw new Error("User not authenticated");
//   }

//   // Get user's latest subscription from Supabase
//   const { data: subscription, error: subscriptionError } = await supabase
//     .from('subscriptions')
//     .select('*')
//     .eq('user_id', user.id)
//     .order('created_at', { ascending: false })
//     .limit(1)
//     .single();

//   if (subscriptionError || !subscription) {
//     throw new Error("Subscription not found");
//   }

//   if (!subscription.ls_subscription_id) {
//     throw new Error("Invalid subscription ID");
//   }

//   // Cancel subscription in LemonSqueezy only
//   await lsCancelSubscription(subscription.ls_subscription_id);

//   revalidatePath('/dashboard/billing');
//   return { success: true };
// }

// export async function createSubscription(variantId: number, embed = false) {
//   const supabase = createClient();
//   const { data: { user }, error: userError } = await supabase.auth.getUser();
//   if (userError || !user) {
//     throw new Error("User not authenticated");
//   }
  
//   const checkout = await createCheckout(
//     process.env.LEMONSQUEEZY_STORE_ID!,
//     variantId,
//     {
//       checkoutOptions: {
//         embed,
//         media: false,
//         logo: !embed
//       },
//       checkoutData: {
//         email: user.email,
//         custom: {
//           user_id: user.id
//         }
//       },
//       productOptions: {
//         enabledVariants: [variantId],
//         redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
//         receiptButtonText: "시작하기",
//         receiptThankYouNote: "결제가 완료되었습니다. 지금 바로 서비스를 이용해보세요"
//       }
//     }
//   )
//   // console.log("CHECKOUT_ERROR", (checkout.data as any).errors);

//   return checkout.data?.data.attributes.url;
// }

// export async function generateInteriorDesign(
//   imageUrl: string,
//   prompt: string,
//   style: string
// ): Promise<Task> {
//   try {
//     const supabase = createClient();
//     console.log("Generating inter₩ior design with:", { imageUrl, prompt, style });

//     const { data: { user }, error: userError } = await supabase.auth.getUser();
//     if (userError || !user) {
//       throw new Error("User not authenticated");
//     }

//     const { data: taskData, error: taskCreateError } = await supabase
//       .from('tasks')
//       .insert({
//         user_id: user.id,
//         processor_name: 'InteriorProcessor',
//         status: 'PENDING',
//         input_data: {
//           imageUrls: [imageUrl],
//           prompt: prompt
//         }
//       })
//       .select('id')
//       .single();

//     if (taskCreateError || !taskData) {
//       console.error("Error creating task:", taskCreateError);
//       throw new Error("Failed to create task");
//     }

//     // `https://webhook.site/c6b46db7-e4b3-4260-870e-5a66ca2f77d1?taskId=${taskData.id}`
//     const response = await fetch('https://api.replicate.com/v1/predictions', {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer 8ded0f67c33aeddbfa4a4423d1f791e2cf4c4cda`,
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         version: "2a360362540e1f6cfe59c9db4aa8aa9059233d40e638aae0cdeb6b41f3d0dcce",
//         webhook: `https://www.redesign.im/api/task/callback?taskId=${taskData.id}`,
//         webhook_events_filter: ["completed"],
//         input: {
//           image: imageUrl,
//           prompt: prompt
//         }
//       })
//     });

//     const predictionData = await response.json();
//     if (!predictionData.id) {
//       await supabase
//         .from('tasks')
//         .update({
//           status: 'FAILED',
//           error_message: 'Failed to start prediction'
//         })
//         .eq('id', taskData.id);

//       throw new Error("Failed to start prediction");
//     }

//     const { error: updateError } = await supabase
//       .from('tasks')
//       .update({
//         status: 'PROCESSING'
//       })
//       .eq('id', taskData.id);

//     if (updateError) {
//       console.error('Error updating task with prediction ID:', updateError);
//     }

//     const { data: subscription } = await supabase
//       .from('subscriptions')
//       .select('ls_subscription_item_id, ls_subscription_item_quantity')
//       .eq('user_id', user.id)
//       .single();

//     await supabase
//       .from('subscriptions')
//       .update({ ls_subscription_item_quantity: (subscription?.ls_subscription_item_quantity || 0) + 1 })
//       .eq('user_id', user.id);

//     await incrementUsage(subscription?.ls_subscription_item_id, 1);

//     return {
//       id: taskData.id,
//       processor_name: 'InteriorProcessor',
//       status: 'PROCESSING',
//       input_data: {
//         image_url: imageUrl
//       },
//       created_at: new Date().toISOString()
//     } as Task;


//     // if (data.id) {
//     //   // Save the task to the database
//     //   const { data: taskData, error } = await supabase
//     //     .from('tasks')
//     //     .insert({
//     //       prediction_id: data.id,
//     //       image_url: imageUrl,
//     //       prompt: prompt,
//     //       style: style,
//     //       status: 'PENDING'
//     //     });

//     //   if (error) {
//     //     console.error("Error saving task to database:", error);
//     //     throw new Error("Failed to save task to database");
//     //   }

//     //   revalidatePath("/dashboard/interior");
//     //   return { success: true, predictionId: data.id };
//     // } else {
//     //   throw new Error("Failed to start prediction");
//     // }
//     // console.log("Prediction started:", data);

//     // if (data.id) {
//     //   revalidatePath("/dashboard/interior");
//     //   return { success: true, predictionId: data.id };
//     // } else {
//     //   throw new Error("Failed to start prediction");
//     // }
//   } catch (error) {
//     console.error("Error generating interior design:", error);
//     throw error;
//   }
// }