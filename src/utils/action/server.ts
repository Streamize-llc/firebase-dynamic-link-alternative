"use server";

import { createClient } from "@/utils/supabase/server";
import crypto from 'crypto';

export async function getProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    throw new Error("Error fetching profile");
  }

  return profile;
}

export async function getProjects() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  // 사용자가 소유하거나 멤버로 속한 모든 프로젝트 가져오기
  const { data: ownedProjects, error: ownedError } = await supabase
    .from('projects')
    .select(`
      id,
      name,
      description,
      created_at,
      owner_id,
      profiles:owner_id (
        user_name,
        avatar_url
      )
    `)
    .eq('owner_id', user.id);

  if (ownedError) {
    throw new Error("소유한 프로젝트 조회 중 오류가 발생했습니다: " + ownedError.message);
  }

  // 사용자가 멤버로 속한 프로젝트 가져오기 (소유자가 아닌 경우)
  const { data: memberProjects, error: memberError } = await supabase
    .from('project_memberships')
    .select(`
      project_id,
      role,
      status,
      projects:project_id (
        id,
        name,
        description,
        created_at,
        owner_id,
        profiles:owner_id (
          user_name,
          avatar_url
        )
      )
    `)
    .eq('user_id', user.id)
    .eq('status', 'ACCEPTED')
    .neq('role', 'OWNER');

  if (memberError) {
    throw new Error("멤버로 속한 프로젝트 조회 중 오류가 발생했습니다: " + memberError.message);
  }

  // 멤버 프로젝트 데이터 형식 변환
  const formattedMemberProjects = memberProjects
    .filter(item => item.projects) // null 체크
    .map(item => item.projects);

  // 두 결과 합치기
  return [...ownedProjects, ...formattedMemberProjects];
}

export async function getProject(projectId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("인증된 사용자가 아닙니다");
  }

  // 프로젝트 정보 가져오기
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select(`
      id,
      name,
      description,
      api_key,
      sub_domain,
      created_at,
      owner_id,
      profiles:owner_id (
        user_name,
        avatar_url
      )
    `)
    .eq('id', projectId)
    .single();

  if (projectError) {
    throw new Error("프로젝트 정보 조회 중 오류가 발생했습니다: " + projectError.message);
  }

  if (!project) {
    throw new Error("프로젝트를 찾을 수 없습니다");
  }

  // 사용자가 이 프로젝트에 접근할 권한이 있는지 확인
  const { data: membership, error: membershipError } = await supabase
    .from('project_memberships')
    .select('role, status')
    .eq('project_id', projectId)
    .eq('user_id', user.id)
    .single();

  if (membershipError && membershipError.code !== 'PGRST116') { // PGRST116: 결과가 없음
    throw new Error("프로젝트 접근 권한 확인 중 오류가 발생했습니다: " + membershipError.message);
  }

  // 프로젝트 소유자가 아니고, 멤버십이 없거나 승인되지 않은 경우 접근 거부
  if (project.owner_id !== user.id && (!membership || membership.status !== 'ACCEPTED')) {
    throw new Error("이 프로젝트에 접근할 권한이 없습니다");
  }

  // 프로젝트에 연결된 앱 정보 가져오기
  const { data: apps, error: appsError } = await supabase
    .from('apps')
    .select('*')
    .eq('project_id', projectId);

  if (appsError) {
    throw new Error("앱 정보 조회 중 오류가 발생했습니다: " + appsError.message);
  }

  // 플랫폼 정보 추가
  const platforms = apps ? apps.map(app => app.platform) : [];
  
  return {
    ...project,
    platforms,
    apps
  };
}

export async function updateProjectSubDomain(projectId: string, subDomain: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  // 서브도메인 중복 확인
  const { data: existingDomain, error: checkError } = await supabase
    .from('projects')
    .select('id')
    .eq('sub_domain', subDomain)
    .neq('id', projectId)
    .single();

  if (existingDomain) {
    throw new Error("이미 사용 중인 서브도메인입니다. 다른 서브도메인을 선택해주세요.");
  }

  const { data: project, error: projectError } = await supabase
    .from('projects')
    .update({ sub_domain: subDomain })
    .eq('id', projectId)
    .select()
    .single();

  if (projectError) {
    throw new Error("프로젝트 도메인 업데이트 중 오류가 발생했습니다: " + projectError.message);
  }

  return project;
}

export async function createProject(name: string, description?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  // 프로젝트 생성 및 소유자 정보 저장
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert({
      name,
      description,
      owner_id: user.id,
      api_key: crypto.randomUUID()
    })
    .select()
    .single();

  if (projectError) {
    throw new Error("프로젝트 생성 중 오류가 발생했습니다: " + projectError.message);
  }

  // 프로젝트 멤버십 생성 (소유자를 멤버로 추가)
  const { error: membershipError } = await supabase
    .from('project_memberships')
    .insert({
      project_id: project.id,
      user_id: user.id,
      invited_by: user.id,
      role: 'OWNER',
      status: 'ACCEPTED',
      accepted_at: new Date().toISOString()
    });

  if (membershipError) {
    throw new Error("프로젝트 멤버십 생성 중 오류가 발생했습니다: " + membershipError.message);
  }

  return project;
}

export async function createApp(projectId: string, platform: 'IOS' | 'ANDROID', platformData: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  
  // 프로젝트에 해당 플랫폼의 앱이 이미 존재하는지 확인
  const { data: existingApp, error: fetchError } = await supabase
    .from('apps')
    .select('*')
    .eq('project_id', projectId)
    .eq('platform', platform)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116는 결과가 없을 때 발생하는 에러 코드
    throw new Error("앱 정보 조회 중 오류가 발생했습니다: " + fetchError.message);
  }

  // 앱 이름 설정
  const appName = platform === 'IOS' ? 'iOS 앱' : '안드로이드 앱';

  // 플랫폼 데이터 유효성 검사
  if (platform === 'IOS' && (!platformData.bundle_id || !platformData.team_id)) {
    throw new Error("iOS 앱 등록을 위해 bundleId와 teamId가 필요합니다.");
  } else if (platform === 'ANDROID' && (!platformData.package_name || !platformData.sha256)) {
    throw new Error("안드로이드 앱 등록을 위해 packageName과 sha256가 필요합니다.");
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
        project_id: projectId,
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