import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { PhoneCall, Mic, MicOff, Volume2, Sparkles } from 'lucide-react';

const initialTranscript = [
  {
    speaker: 'System',
    text: 'مرحباً! الصوت بالدارجة والعربية متاح الآن. اضغط على الميكروفون وابدأ الكلام، وسأقوم بتحويله إلى نص مباشر.',
  },
];

const languageOptions = [
  { value: 'ar-MA', label: 'الدارجة / Darija' },
  { value: 'ar-SA', label: 'العربية الفصحى / Arabic' },
];

export default function VoiceCall() {
  const [isConnected, setIsConnected] = useState(false);
  const [transcript, setTranscript] = useState(initialTranscript);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [language, setLanguage] = useState('ar-MA');
  const [recognitionSupported, setRecognitionSupported] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const activeLanguageLabel = useMemo(
    () => languageOptions.find((option) => option.value === language)?.label || 'الدارجة / Darija',
    [language]
  );

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setRecognitionSupported(false);
      setErrorMessage('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      let interim = '';
      let finalText = '';

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += `${result[0].transcript.trim()} `;
        } else {
          interim += `${result[0].transcript.trim()} `;
        }
      }

      interim = interim.trim();
      finalText = finalText.trim();

      if (interim) {
        setInterimTranscript(interim);
      }

      if (finalText) {
        setTranscript((current) => [
          ...current,
          { speaker: 'User', text: finalText },
        ]);
        setInterimTranscript('');
      }
    };

    recognition.onerror = (event: any) => {
      setErrorMessage(`Speech recognition error: ${event.error}`);
    };

    recognition.onend = () => {
      if (isConnected) {
        try {
          recognition.start();
        } catch (error) {
          setErrorMessage('Stopped listening. Please tap the mic again.');
          setIsConnected(false);
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognition) {
        recognition.stop();
      }
      recognitionRef.current = null;
    };
  }, [isConnected, language]);

  const handleToggleCall = () => {
    if (!recognitionSupported) {
      return;
    }

    const recognition = recognitionRef.current;

    if (isConnected) {
      if (recognition) {
        recognition.stop();
      }
      setIsConnected(false);
      setInterimTranscript('');
      setTranscript((current) => [
        ...current,
        { speaker: 'System', text: 'تم إيقاف التسجيل الصوتي. يمكنك قراءة النص المرسل أعلاه.' },
      ]);
      return;
    }

    if (!recognition) {
      setErrorMessage('Speech engine is not ready yet. Please refresh the page.');
      return;
    }

    try {
      recognition.lang = language;
      recognition.start();
      setIsConnected(true);
      setErrorMessage(null);
      setTranscript((current) => [
        ...current,
        { speaker: 'System', text: `جاري الاستماع الآن (${activeLanguageLabel}). تحدث بالدارجة أو العربية.` },
      ]);
    } catch (error) {
      setErrorMessage('Could not start voice recognition. Please allow microphone access and try again.');
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">AI Voice Call</h1>
          <p className="text-slate-500 max-w-2xl">
            Speak in الدارجة or العربية and the app will transcribe what you say into text live.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-2xl bg-green-600/10 px-4 py-3 text-green-700">
          <PhoneCall className="h-5 w-5" />
          <span className="text-sm font-semibold">Voice channel ready</span>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.6fr] gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <p className="text-sm font-medium text-slate-500">Live call status</p>
              <h2 className="text-2xl font-semibold text-slate-900">
                {isConnected ? 'Listening now' : 'Ready to speak'}
              </h2>
            </div>
            <div className="relative flex items-center justify-center">
              <span
                className={`absolute inline-flex h-24 w-24 rounded-full bg-green-400/20 ${isConnected ? 'animate-ping' : ''}`}
              />
              <button
                onClick={handleToggleCall}
                className={`relative inline-flex items-center justify-center rounded-full h-20 w-20 transition ${
                  isConnected
                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20'
                    : 'bg-green-600 text-white shadow-xl shadow-green-600/30'
                }`}
              >
                {isConnected ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
              </button>
            </div>
          </div>

          <p className="text-sm text-slate-600 mb-6">
            Press the mic to start or stop live speech transcription. The text will appear below as you speak.
          </p>

          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Language</p>
              <p className="mt-2 text-sm text-slate-900">{activeLanguageLabel}</p>
            </div>
            <div className="flex gap-2">
              {languageOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setLanguage(option.value)}
                  className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                    language === option.value
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {errorMessage ? (
            <div className="mb-4 rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              {errorMessage}
            </div>
          ) : null}

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 min-h-[320px] overflow-auto">
            <div className="space-y-5">
              {transcript.map((message, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold uppercase text-slate-700">
                      {message.speaker.slice(0, 2)}
                    </span>
                    <span className="text-sm font-semibold text-slate-900">{message.speaker}</span>
                  </div>
                  <p className="text-slate-700 leading-7">{message.text}</p>
                </div>
              ))}

              {isConnected && interimTranscript ? (
                <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-xs font-semibold uppercase text-amber-700">
                      ⏳
                    </span>
                    <span className="text-sm font-semibold text-amber-900">Listening...</span>
                  </div>
                  <p className="text-amber-900">{interimTranscript}</p>
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">Speech mode</p>
              <p className="mt-3 text-xl font-semibold text-slate-900">
                {isConnected ? 'Live transcription' : 'Ready'}
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">Mode support</p>
              <p className="mt-3 text-xl font-semibold text-slate-900">دارجة / عربية</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Volume2 className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-slate-900">Call summary</h3>
            </div>
            <p className="text-sm text-slate-600 leading-7">
              Live transcription records what you say in Arabic or Darija. Use it for quick field notes, instructions, or hands-free reporting.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-slate-500">Best use cases</p>
                <h3 className="text-lg font-semibold text-slate-900">Hands-free field support</h3>
              </div>
              <Sparkles className="h-6 w-6 text-amber-500" />
            </div>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />سجل كلامك مباشرة بدون كتابة.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />احتفظ بنسخة نصية لما تقول في الحقل.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />استخدم النص لتوثيق المناقشات بالدارجة أو العربية.
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
