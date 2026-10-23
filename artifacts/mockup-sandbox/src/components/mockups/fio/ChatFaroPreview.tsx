import { ChatFaro } from './_shared/suite/ChatFaro';
import { SuiteProvider } from './_shared/suite/state';
import { useLeadConnectorAgent } from './_shared/useLeadConnectorAgent';
import './_shared/suite/suite.css';
import '../../../../../faro-design-system/src/components/faro.css';
import './_shared/mascot.css';

export function ChatFaroPreview() {
  useLeadConnectorAgent();
  return <SuiteProvider initialPage="chat"><div className="faro-suite" style={{ minHeight: '100dvh' }}><main className="content"><ChatFaro/></main></div></SuiteProvider>;
}
export default ChatFaroPreview;
