export async function collectFingerprintData() {
    if (typeof window.FingerprintJS === 'undefined') {
      throw new Error('FingerprintJS não foi carregado corretamente.');
    }
  
    const fp = await window.FingerprintJS.load();
    const result = await fp.get();

    const data = {
      visitorId: result.visitorId,
      components: result.components
    };

    return JSON.stringify(data, null, 2);
  }
  