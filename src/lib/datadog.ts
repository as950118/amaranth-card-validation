import { datadogRum } from '@datadog/browser-rum';

let isInitialized = false;

export function initDatadogRum() {
  // 클라이언트 사이드에서만 실행되도록 확인
  if (typeof window !== 'undefined' && !isInitialized) {
    try {
      datadogRum.init({
        applicationId: '9eb0b824-7fbb-4a32-bf00-039669dd8302',
        clientToken: 'pubd836472c13323e1ae5ca325a9c2d511a',
        site: 'datadoghq.com',
        service: 'test-jhj',
        env: 'dev',
        sessionSampleRate: 100, // 모든 세션 수집
        sessionReplaySampleRate: 20,
        defaultPrivacyLevel: 'mask-user-input',
        trackResources: true,
        trackLongTasks: true,
        trackUserInteractions: true,
      });
      
      isInitialized = true;
      console.log('Datadog RUM initialized successfully');
      
      // 테스트 이벤트 전송
      setTimeout(() => {
        datadogRum.addAction('test_action', {
          message: 'Datadog RUM test action',
          timestamp: new Date().toISOString(),
        });
        console.log('Test action sent to Datadog RUM');
      }, 2000);
      
    } catch (error) {
      console.error('Failed to initialize Datadog RUM:', error);
    }
  }
}

// 커스텀 이벤트 전송 함수
export function sendCustomEvent(eventName: string, attributes?: Record<string, any>) {
  if (typeof window !== 'undefined' && isInitialized) {
    try {
      datadogRum.addAction(eventName, attributes || {});
      console.log(`Custom event sent: ${eventName}`, attributes);
    } catch (error) {
      console.error('Failed to send custom event:', error);
    }
  }
} 