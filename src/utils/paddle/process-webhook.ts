import {
  CustomerCreatedEvent,
  CustomerUpdatedEvent,
  EventEntity,
  EventName,
  SubscriptionCreatedEvent,
  SubscriptionUpdatedEvent,
} from '@paddle/paddle-node-sdk';
import { createClient } from '@/utils/supabase/server';

interface CustomData {
  userId: string;
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
      
      console.log("customData", customData);

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