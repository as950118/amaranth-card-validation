import { datadogRum } from '@datadog/browser-rum';

export function initDatadogRum() {
  // 클라이언트 사이드에서만 실행되도록 확인
  if (typeof window !== 'undefined') {
    datadogRum.init({
      applicationId: '9eb0b824-7fbb-4a32-bf00-039669dd8302',
      clientToken: 'pubd836472c13323e1ae5ca325a9c2d511a',
      site: 'datadoghq.com',
      service: 'test-jhj',
      env: 'dev',
      sessionSampleRate: 10,
      sessionReplaySampleRate: 20,
      defaultPrivacyLevel: 'mask-user-input',
    });
  }
} 