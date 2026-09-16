import HostPricing from "./components/HostPricing";
import WebPricing from "./components/WebPricing";

function Service() {
  return (
    <section className='space-y-5'>
      <HostPricing />
      <WebPricing />
    </section>
  );
}

export default Service;
