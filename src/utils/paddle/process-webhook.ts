import {
  CustomerCreatedEvent,
  CustomerUpdatedEvent,
  EventEntity,
  EventName,
  SubscriptionCreatedEvent,
  SubscriptionUpdatedEvent,
} from '@paddle/paddle-node-sdk';
import { createClient } from '@/utils/supabase/server';
import { getSubscriptionInfoFromPriceId } from './subscription-item';

interface CustomData {
  userId: string;
  projectId: string;
}

export class ProcessWebhook {
  async processEvent(eventData: EventEntity) {
    switch (eventData.eventType) {
      case EventName.SubscriptionCreated:
      case EventName.SubscriptionUpdated:
        await this.updateSubscriptionData(eventData);
        break;
      case EventName.CustomerCreated:
      case EventName.CustomerUpdated:
        // await this.updateCustomerData(eventData);
        break;
    }
  }

  private async updateSubscriptionData(eventData: SubscriptionCreatedEvent | SubscriptionUpdatedEvent) {
    try {
      const supabase = await createClient();
      const customData = eventData.data.customData as CustomData;
      // 먼저 subscription_id로 기존 구독 정보 확인
      const { data: existingSubscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('subscription_id', eventData.data.id)
        .maybeSingle();

      let response;
      if (existingSubscription) {
        // 기존 구독이 있으면 업데이트
        response = await supabase
          .from('subscriptions')
          .update({
            user_id: customData.userId || '',
            subscription_status: eventData.data.status,
            price_id: eventData.data.items[0].price?.id || '',
            product_id: eventData.data.items[0].price?.productId || '',
            scheduled_change: eventData.data.scheduledChange?.effectiveAt || null,
            paddle_customer_id: eventData.data.customerId,
          })
          .eq('subscription_id', eventData.data.id)
          .select();
      } else {
        // 기존 구독이 없으면 새로 삽입
        eventData.data.status
        response = await supabase
          .from('subscriptions')
          .insert({
            user_id: customData.userId || '',
            subscription_id: eventData.data.id,
            subscription_status: eventData.data.status,
            price_id: eventData.data.items[0].price?.id || '',
            product_id: eventData.data.items[0].price?.productId || '',
            scheduled_change: eventData.data.scheduledChange?.effectiveAt || null,
            paddle_customer_id: eventData.data.customerId,
          })
          .select();
      }

      // 프로젝트 정보 조회
      const { data: project } = await supabase
        .from('workspaces')
        .select('*')
        .eq('id', customData.projectId)
        .maybeSingle();
      
      // 프로젝트가 존재하면 구독 정보 업데이트
      console.log("WOW", project, response.data);
      if (project && response.data) {
        if (eventData.data.status === 'active') {
          const subscriptionInfo = getSubscriptionInfoFromPriceId(eventData.data.items[0].price?.id || '');
          await supabase
            .from('workspaces')
            .update({
              active_subscription_id: response.data[0].id,
              subscription_status: eventData.data.status,
              plan_type: subscriptionInfo.planType,
              current_monthly_click_count: 0,
              current_monthly_create_count: 0,
              next_quota_update_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              next_subscription_update_at: eventData.data.nextBilledAt
            })
            .eq('id', customData.projectId);
        } else {
          await supabase
            .from('workspaces')
            .update({
              subscription_status: eventData.data.status
            })
            .eq('id', customData.projectId);
        }
      }

      console.log(response);
    } catch (e) {
      console.error(e);
    }
  }

  // private async updateCustomerData(eventData: CustomerCreatedEvent | CustomerUpdatedEvent) {
  //   try {
  //     const supabase = await createClient();
  //     const response = await supabase
  //       .from('customers')
  //       .upsert({
  //         customer_id: eventData.data.id,
  //         email: eventData.data.email,
  //       })
  //       .select();
  //     console.log(response);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }
}