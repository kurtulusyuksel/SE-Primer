import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Initialize Gemini client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client, will use intelligent heuristic fallback:', err);
  }
}

// Deep Socratic fallback knowledge base for all decisions
function getHeuristicSocraticResponse(
  userQuery: string,
  step: string,
  userLevel: string,
  choices: { step1?: string; step2?: string; step3?: string }
): string {
  const q = userQuery.toLowerCase();

  // Acceptance Criteria AC-5 explicit test: "Hangi şıkkı seçmeliyim?" or "Cevap ne?"
  if (
    q.includes('hangi şık') ||
    q.includes('cevap ne') ||
    q.includes('hangi secenek') ||
    q.includes('hangisini seç') ||
    q.includes('ne yapmalıyım') ||
    q.includes('hangisi doğru') ||
    q.includes('tavsiyen ne')
  ) {
    if (step === 'step1') {
      return 'Asenkron kuyruğa geçtiğinde veritabanındaki stok durumunun anlık güncellenip güncellenmeyeceğini ve sipariş onayının kullanıcıya nasıl hissettirileceğini düşündün mü? Monoliti yeniden başlatırsan kapıda bekleyen 120.000 aç bağlantı thread havuzuna tekrar yüklendiğinde ne olmasını öngörüyorsun?';
    }
    if (step === 'step2') {
      return 'Kriz anında testleri atlayıp hemen canlıya almak sana 30 saniye kazandırabilir; fakat ödeme sağlayıcısının webhook imza formatında veya idempotency anahtarında gizli bir regresyon varsa bunu canlı müşteriler üzerinde mi tespit etmek istersin?';
    }
    if (step === 'step3') {
      return 'Canlı logları ham haliyle tüm geliştirme ekibine ve Slack kanalına iletirsen, loglara erişimi olan üçüncü tarafların veya kayıt tutucuların müşterilerin 16 haneli kredi kartı numaralarına (PAN) erişmesi durumunda şirketinin karşılaşacağı PCI-DSS ve KVKK yaptırımlarını değerlendirdin mi?';
    }
    return 'Bir baş mühendis kriz anında kararı başkasına bırakmaz; mimari darboğazın kök nedenini analiz eder. Sence şu anda en büyük risk sistemin çökmesi mi, yoksa telafisi imkansız bir veri ve finansal güvenlik ihlali yaratmak mı?';
  }

  // Step 1: Architecture questions
  if (step === 'step1' || q.includes('asenkron') || q.includes('kuyruk') || q.includes('rabbitmq') || q.includes('kafka') || q.includes('monolit')) {
    if (q.includes('risk') || q.includes('dezavantaj')) {
      return 'Asenkron kuyruk yapısı (RabbitMQ/Kafka) ani yük dalgalanmalarını tamponlar; ancak sipariş durumu "İşleniyor" olarak asenkron tamamlanırken kullanıcının butona mükerrer basmasını (idempotency eksikliği) nasıl engelleyeceksin?';
    }
    if (q.includes('monolit') || q.includes('restart') || q.includes('yeniden başlat')) {
      return 'Veritabanı kilitlenmesi (Deadlock) yaşayan bir monolit servisi restart etmek geçici bir rahatlama sağlar mı, yoksa kuyrukta birikmiş binlerce bekleyen istek anında aynı lock tablosuna tekrar hücum edip kaskat bir çöküşe mi neden olur?';
    }
    return 'Trafik patlaması anında doğrudan ilişkisel veritabanına giden 40.000 RPS sorgu akışını kontrol altına almak için sence veritabanını mı ölçeklemeli, yoksa talepleri kontrollü hızda tüketen bir tampon katmanı mı kurmalı?';
  }

  // Step 2: Testing questions
  if (step === 'step2' || q.includes('test') || q.includes('staging') || q.includes('çift çekim') || q.includes('regresyon')) {
    if (q.includes('hız') || q.includes('zaman') || q.includes('vakit')) {
      return 'Staging ortamında 30 saniyelik bir sanity/regression testi koşmak Muhteşem Cuma gecesinde zaman kaybı gibi görünebilir. Peki 10.000 müşterinin kartından iki kez para çekilmesi (double charge) riskini temizlemek için bu 30 saniyeyi feda etmeye değer mi?';
    }
    return 'Ödeme kuyruk tüketicisini canlıya almadan önce simüle edilmiş sahte bir webhook ile test etmezsen, bankanın döndüğü response formatındaki mikro bir değişikliğin yaratacağı kaosu nasıl öngörebilirsin?';
  }

  // Step 3: Security & KVKK & PCI-DSS
  if (step === 'step3' || q.includes('kvkk') || q.includes('pci') || q.includes('log') || q.includes('maske') || q.includes('kart')) {
    if (q.includes('debug') || q.includes('hızlı') || q.includes('ekip')) {
      return 'Mühendislerin hatayı 2 dakika daha hızlı çözmesi için loglarda tam kart numarasını ve CVV kodunu açık bırakmak meşru bir aciliyet midir? PCI-DSS Requirement 3.4 ve KVKK Madde 12 hangi şartlarda istisna tanır?';
    }
    return 'Log satırlarındaki PAN (Primary Account Number) verisinin ilk 6 ve son 4 hanesi dışındaki kısımlarını maskelemenin sistem hata tespit süresine sence gerçekte ne kadarlık bir olumsuz etkisi olabilir?';
  }

  // General Socratic fallback
  return 'Sistem telemetrisine dikkatle bak: p99 gecikmesi 1850ms ve bağlantı havuzu tükenmiş durumda. Alacağın aksiyonun anlık bir yara bandı mı, yoksa sistemi sabaha kadar ayakta tutacak kök bir iyileştirme mi olduğunu nasıl temellendirirsin?';
}

// Socratic AI Tutor API Endpoint
app.post('/api/socratic-tutor', async (req, res) => {
  try {
    const { message, step, userLevel, choices } = req.body;
    const query = (message || '').trim();

    if (!query) {
      return res.status(400).json({ error: 'Soru metni gereklidir.' });
    }

    // Try Gemini API if configured
    if (aiClient) {
      try {
        const systemInstruction = `Sen "Muhteşem Cuma Kriz Odası (SE Primer)" kıdemli sistem mimarı ve Sokratik Yapay Zeka Mentorüsün ("Socrates Core").
SENİN TEK VE EN KATI KURALIN: ASLA VE ASLA DOĞRUDAN CEVAP, TAVSİYE VEYA ŞIK (A ya da B) VERME!
Kullanıcı "Hangi şıkkı seçmeliyim?", "Cevap ne?", "Doğru olan hangisi?" diye sorsa dahi, kesinlikle şıkkı işaret etme.
Bunun yerine kullanıcının zihnini açacak, mimari derinliği olan, kök neden analizi (RCA), veri tutarlılığı, idempotency, PCI-DSS / KVKK yükümlülükleri ve yük altında kuyruk mekanizmaları hakkında 1-2 adet güçlü, düşündürücü Sokratik soru yönelt.
Mevcut Kriz Adımı: ${step || 'Genel Kriz'}
Kullanıcı Deneyim Seviyesi: ${userLevel === 'experienced' ? 'Deneyimli Mühendis (Stres Modu)' : 'Yeni Başlayan (Rehberli Mod)'}
Daha Önceki Seçimler: ${JSON.stringify(choices || {})}
Üslubun: Taktiksel, sakin, teknik jargona hakim bir kıdemli baş mühendis gibi; kısa, vurucu ve yalnızca Sokratik soru soran formatta olmalı. Türkçe yanıt ver.`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            {
              role: 'user',
              parts: [{ text: `Kullanıcı Sorusu: "${query}"` }],
            },
          ],
          config: {
            systemInstruction,
            temperature: 0.7,
            maxOutputTokens: 250,
          },
        });

        const reply = response.text?.trim();
        if (reply) {
          return res.json({ reply, source: 'gemini' });
        }
      } catch (geminiError) {
        console.warn('Gemini API call failed, switching to local socratic engine:', geminiError);
      }
    }

    // High quality local Socratic heuristic engine
    const fallbackReply = getHeuristicSocraticResponse(query, step || 'step1', userLevel || 'beginner', choices || {});
    return res.json({ reply: fallbackReply, source: 'socratic-engine' });
  } catch (error) {
    console.error('Socratic tutor handler error:', error);
    return res.status(500).json({
      error: 'Sokratik mentor yanıt üretemedi.',
      reply: 'Mimari kriz anında her değişken birbirini tetikler. Veritabanı darboğazı yaşanırken ilk olarak thread havuzunun mu yoksa ağ kuyruğunun mu nefes alması gerektiğini düşünüyorsun?',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[SE Primer] Crisis Command Room server running on port ${port}`);
  });
}

startServer();
