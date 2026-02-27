let utterance;
const synth = window.speechSynthesis;

export function speak(text, options) {
    if (!text) return;
    stop();

    utterance = new SpeechSynthesisUtterance(text);

    if (options) {
        const { voiceName, rate, pitch, volume } = options;
        if (voiceName) {
            const v = synth.getVoices().find(x => x.name === voiceName);
            if (v) utterance.voice = v;
        }
        if (rate) utterance.rate = rate;   // 0.1–10 (default 1)
        if (pitch) utterance.pitch = pitch;  // 0–2 (default 1)
        if (volume) utterance.volume = volume; // 0–1 (default 1)
    }

    synth.speak(utterance);
}

export function stop() {
    if (synth.speaking || synth.pending) synth.cancel();
}

export function getVoices() {
    // Return minimal data safe for JSInterop
    return synth.getVoices().map(v => ({ name: v.name, lang: v.lang, isDefault: v.default }));
}

// Some browsers populate voices async; await once.
export async function waitForVoices() {
    if (synth.getVoices().length) return synth.getVoices().length;
    return new Promise(resolve => {
        const handler = () => {
            synth.onvoiceschanged = null;
            resolve(synth.getVoices().length);
        };
        synth.onvoiceschanged = handler;
    });
}
