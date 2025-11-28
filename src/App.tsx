import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  CheckCircle, 
  Calendar, 
  Flame, 
  Users, 
  Target, 
  ChevronLeft,
  ChevronRight,
  Trophy,
  UserPlus,
  Sparkles,
  ScrollText,
  Heart,
  ShieldCheck,
  LogOut,
  AlertTriangle,
  Lock,
  Mail,
  User as UserIcon,
  LogIn
} from 'lucide-react';

// Importações do Firebase
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';

// --- SUAS CHAVES CONFIGURADAS ---
const apiKey = "AIzaSyAcYF4Uozq-Z3vB72AqOwudfAglCp6k4kU"; 

const firebaseConfig = {
  apiKey: "AIzaSyA9KJqAG2HE3we4mtufa9fctQNXy2v96f0",
  authDomain: "jornada90dias.firebaseapp.com",
  projectId: "jornada90dias",
  storageBucket: "jornada90dias.firebasestorage.app",
  messagingSenderId: "577447169048",
  appId: "1:577447169048:web:8a35e82cd707825e8dc76d"
};

// --- INICIALIZAÇÃO SEGURA ---
let app: any;
let auth: any;
let db: any;
let firebaseError: any = null;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (e: any) {
  console.error("Erro ao iniciar Firebase:", e);
  firebaseError = "Erro na conexão com o banco de dados. Recarregue a página.";
}

const appId = "jornada90dias";

// --- DADOS DO PLANO ---
const rawPlanData = [
  { day: 1, ref: "Mateus 1-3", book: "Mateus", isBookEnd: false },
  { day: 2, ref: "Mateus 4-6", book: "Mateus", isBookEnd: false },
  { day: 3, ref: "Mateus 7-9", book: "Mateus", isBookEnd: false },
  { day: 4, ref: "Mateus 10-12", book: "Mateus", isBookEnd: false },
  { day: 5, ref: "Mateus 13-15", book: "Mateus", isBookEnd: false },
  { day: 6, ref: "Mateus 16-18", book: "Mateus", isBookEnd: false },
  { day: 7, ref: "Mateus 19-21", book: "Mateus", isBookEnd: false },
  { day: 8, ref: "Mateus 22-24", book: "Mateus", isBookEnd: false },
  { day: 9, ref: "Mateus 25-26", book: "Mateus", isBookEnd: false },
  { day: 10, ref: "Mateus 27-28", book: "Mateus", isBookEnd: true },
  { day: 11, ref: "Marcos 1-3", book: "Marcos", isBookEnd: false },
  { day: 12, ref: "Marcos 4-5", book: "Marcos", isBookEnd: false },
  { day: 13, ref: "Marcos 6-8", book: "Marcos", isBookEnd: false },
  { day: 14, ref: "Marcos 9-11", book: "Marcos", isBookEnd: false },
  { day: 15, ref: "Marcos 12-14", book: "Marcos", isBookEnd: false },
  { day: 16, ref: "Marcos 15-16", book: "Marcos", isBookEnd: true },
  { day: 17, ref: "Lucas 1-2", book: "Lucas", isBookEnd: false },
  { day: 18, ref: "Lucas 3-5", book: "Lucas", isBookEnd: false },
  { day: 19, ref: "Lucas 6-8", book: "Lucas", isBookEnd: false },
  { day: 20, ref: "Lucas 9-10", book: "Lucas", isBookEnd: false },
  { day: 21, ref: "Lucas 11-13", book: "Lucas", isBookEnd: false },
  { day: 22, ref: "Lucas 14-16", book: "Lucas", isBookEnd: false },
  { day: 23, ref: "Lucas 17-18", book: "Lucas", isBookEnd: false },
  { day: 24, ref: "Lucas 19-20", book: "Lucas", isBookEnd: false },
  { day: 25, ref: "Lucas 21-22", book: "Lucas", isBookEnd: false },
  { day: 26, ref: "Lucas 23-24", book: "Lucas", isBookEnd: true },
  { day: 27, ref: "João 1-2", book: "João", isBookEnd: false },
  { day: 28, ref: "João 3-5", book: "João", isBookEnd: false },
  { day: 29, ref: "João 6-8", book: "João", isBookEnd: false },
  { day: 30, ref: "João 9-11", book: "João", isBookEnd: false },
  { day: 31, ref: "João 12-13", book: "João", isBookEnd: false },
  { day: 32, ref: "João 14-16", book: "João", isBookEnd: false },
  { day: 33, ref: "João 17-19", book: "João", isBookEnd: false },
  { day: 34, ref: "João 20-21", book: "João", isBookEnd: true },
  { day: 35, ref: "Atos 1-2", book: "Atos", isBookEnd: false },
  { day: 36, ref: "Atos 3-5", book: "Atos", isBookEnd: false },
  { day: 37, ref: "Atos 6-7", book: "Atos", isBookEnd: false },
  { day: 38, ref: "Atos 8-9", book: "Atos", isBookEnd: false },
  { day: 39, ref: "Atos 10-11", book: "Atos", isBookEnd: false },
  { day: 40, ref: "Atos 12-14", book: "Atos", isBookEnd: false },
  { day: 41, ref: "Atos 15-16", book: "Atos", isBookEnd: false },
  { day: 42, ref: "Atos 17-18", book: "Atos", isBookEnd: false },
  { day: 43, ref: "Atos 19-21", book: "Atos", isBookEnd: false },
  { day: 44, ref: "Atos 22-23", book: "Atos", isBookEnd: false },
  { day: 45, ref: "Atos 24-25", book: "Atos", isBookEnd: false },
  { day: 46, ref: "Atos 26-28", book: "Atos", isBookEnd: true },
  { day: 47, ref: "Romanos 1-3", book: "Romanos", isBookEnd: false },
  { day: 48, ref: "Romanos 4-6", book: "Romanos", isBookEnd: false },
  { day: 49, ref: "Romanos 7-8", book: "Romanos", isBookEnd: false },
  { day: 50, ref: "Romanos 9-10", book: "Romanos", isBookEnd: false },
  { day: 51, ref: "Romanos 11-13", book: "Romanos", isBookEnd: false },
  { day: 52, ref: "Romanos 14-16", book: "Romanos", isBookEnd: true },
  { day: 53, ref: "1 Coríntios 1-3", book: "1 Coríntios", isBookEnd: false },
  { day: 54, ref: "1 Coríntios 4-6", book: "1 Coríntios", isBookEnd: false },
  { day: 55, ref: "1 Coríntios 7-9", book: "1 Coríntios", isBookEnd: false },
  { day: 56, ref: "1 Coríntios 10-11", book: "1 Coríntios", isBookEnd: false },
  { day: 57, ref: "1 Coríntios 12-14", book: "1 Coríntios", isBookEnd: false },
  { day: 58, ref: "1 Coríntios 15-16", book: "1 Coríntios", isBookEnd: true },
  { day: 59, ref: "2 Coríntios 1-3", book: "2 Coríntios", isBookEnd: false },
  { day: 60, ref: "2 Coríntios 4-7", book: "2 Coríntios", isBookEnd: false },
  { day: 61, ref: "2 Coríntios 8-10", book: "2 Coríntios", isBookEnd: false },
  { day: 62, ref: "2 Coríntios 11-13", book: "2 Coríntios", isBookEnd: true },
  { day: 63, ref: "Gálatas 1-3", book: "Gálatas", isBookEnd: false },
  { day: 64, ref: "Gálatas 4-6", book: "Gálatas", isBookEnd: true },
  { day: 65, ref: "Efésios 1-3", book: "Efésios", isBookEnd: false },
  { day: 66, ref: "Efésios 4-6", book: "Efésios", isBookEnd: true },
  { day: 67, ref: "Filipenses 1-4", book: "Filipenses", isBookEnd: true },
  { day: 68, ref: "Colossenses 1-4", book: "Colossenses", isBookEnd: true },
  { day: 69, ref: "1 Tessalonicenses 1-5", book: "1 Tessalonicenses", isBookEnd: true },
  { day: 70, ref: "2 Tessalonicenses 1-3", book: "2 Tessalonicenses", isBookEnd: true },
  { day: 71, ref: "1 Timóteo 1-3", book: "1 Timóteo", isBookEnd: false },
  { day: 72, ref: "1 Timóteo 4-6", book: "1 Timóteo", isBookEnd: true },
  { day: 73, ref: "2 Timóteo 1-4", book: "2 Timóteo", isBookEnd: true },
  { day: 74, ref: "Tito e Filemom", book: "Tito/Filemom", isBookEnd: true },
  { day: 75, ref: "Hebreus 1-3", book: "Hebreus", isBookEnd: false },
  { day: 76, ref: "Hebreus 4-6", book: "Hebreus", isBookEnd: false },
  { day: 77, ref: "Hebreus 7-10", book: "Hebreus", isBookEnd: false },
  { day: 78, ref: "Hebreus 11-13", book: "Hebreus", isBookEnd: true },
  { day: 79, ref: "Tiago 1-5", book: "Tiago", isBookEnd: true },
  { day: 80, ref: "1 Pedro 1-5", book: "1 Pedro", isBookEnd: true },
  { day: 81, ref: "2 Pedro 1-3", book: "2 Pedro", isBookEnd: true },
  { day: 82, ref: "1 João 1-5", book: "1 João", isBookEnd: true },
  { day: 83, ref: "2 e 3 João", book: "2/3 João", isBookEnd: true },
  { day: 84, ref: "Apocalipse 1-3", book: "Apocalipse", isBookEnd: false },
  { day: 85, ref: "Apocalipse 4-7", book: "Apocalipse", isBookEnd: false },
  { day: 86, ref: "Apocalipse 8-10", book: "Apocalipse", isBookEnd: false },
  { day: 87, ref: "Apocalipse 11-13", book: "Apocalipse", isBookEnd: false },
  { day: 88, ref: "Apocalipse 14-16", book: "Apocalipse", isBookEnd: false },
  { day: 89, ref: "Apocalipse 17-19", book: "Apocalipse", isBookEnd: false },
  { day: 90, ref: "Apocalipse 20-22", book: "Apocalipse", isBookEnd: true },
];

// --- MENSAGEM PADRÃO ---
const getStaticReflection = () => {
  return "Ao ler este texto, lembre-se: Deus está com você em cada detalhe da sua jornada.";
};

// --- COMPONENTES UI ---
// @ts-ignore
const ProgressBar = ({ current, total }: {current: any, total: any}) => {
  const percent = Math.min(100, Math.max(0, (current / total) * 100));
  return (
    <div className="w-full bg-slate-800 rounded-full h-2.5 mb-2 border border-slate-700 overflow-hidden">
      <div className="bg-amber-600 h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${percent}%` }}></div>
    </div>
  );
};

// @ts-ignore
const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-md w-full p-6 relative shadow-2xl">
        <h3 className="text-xl font-bold text-amber-500 mb-4">{title}</h3>
        <div className="text-slate-300 mb-6 max-h-[70vh] overflow-y-auto custom-scrollbar">{children}</div>
        <button onClick={onClose} className="w-full bg-amber-700 hover:bg-amber-600 text-white py-3 rounded font-bold transition-colors">Entendido</button>
      </div>
    </div>
  );
};

// --- APLICATIVO PRINCIPAL ---
export default function App() {
  // Se o Firebase falhou
  if (firebaseError) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-10 flex flex-col items-center justify-center text-center">
        <AlertTriangle className="text-red-500 mb-4" size={48} />
        <h1 className="text-2xl font-bold mb-2">Ops! Algo deu errado.</h1>
        <p className="text-slate-400 mb-4">{firebaseError}</p>
        <button onClick={() => window.location.reload()} className="bg-slate-800 px-4 py-2 rounded">Tentar Novamente</button>
      </div>
    );
  }

  // Estados UI
  const [currentView, setCurrentView] = useState<'dashboard' | 'plan' | 'ranking'>('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", body: "" });
  const [loading, setLoading] = useState(true);
  const [isLoginView, setIsLoginView] = useState(true);

  // Estados Auth (Usando 'any' para evitar erros de build)
  const [user, setUser] = useState<any>(null);
  const [userName, setUserName] = useState<any>(null);
  
  // Inputs
  const [inputName, setInputName] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [tempName, setTempName] = useState(""); // VARIÁVEL RESTAURADA!

  // Dados
  const [completedDays, setCompletedDays] = useState<any[]>([]);
  const [streak, setStreak] = useState(0);
  const [savedReflections, setSavedReflections] = useState<any>({});
  const [reflectionInput, setReflectionInput] = useState("");
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  
  // AI
  const [aiLoading, setAiLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState<any>(null);

  // Data Atual
  const startDate = new Date('2025-12-01T00:00:00');
  const today = new Date();
  const daysDiff = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const activeDayNumber = Math.max(1, Math.min(90, daysDiff > 0 ? daysDiff : 1));
  const [viewDay, setViewDay] = useState(activeDayNumber);
  const activeDayData = rawPlanData.find(d => d.day === viewDay) || rawPlanData[0];
  const isCompleted = completedDays.includes(activeDayData.day);

  // Handlers Auth
  const handleAuth = async () => {
    if (!inputEmail || !inputPassword) return;
    setLoading(true);
    setAuthError("");

    try {
      if (isLoginView) {
        await signInWithEmailAndPassword(auth, inputEmail, inputPassword);
      } else {
        if (!inputName) {
          setAuthError("Por favor, digite seu nome.");
          setLoading(false);
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, inputEmail, inputPassword);
        const newUser = userCredential.user;
        
        // @ts-ignore
        await updateProfile(newUser, { displayName: inputName });
        
        await setDoc(doc(db, 'artifacts', appId, 'users', newUser.uid, 'data', 'profile'), {
          name: inputName, completedDays: [], createdAt: serverTimestamp()
        }, { merge: true });
        
        await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'leaderboard', newUser.uid), {
          name: inputName, count: 0, lastUpdate: serverTimestamp()
        }, { merge: true });
      }
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/invalid-email') setAuthError("E-mail inválido.");
      else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') setAuthError("E-mail ou senha incorretos.");
      else if (error.code === 'auth/email-already-in-use') setAuthError("Este e-mail já está cadastrado.");
      else if (error.code === 'auth/weak-password') setAuthError("A senha deve ter pelo menos 6 caracteres.");
      else setAuthError("Erro ao conectar. Tente novamente.");
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUserName(null);
    setCompletedDays([]);
    setSavedReflections({});
    setStreak(0);
  };

  // Gemini AI
  const callGemini = async (promptType: any) => {
    setAiLoading(true);
    setAiInsight(null);
    try {
      const readingRef = activeDayData.ref;
      let instruction = "";
      
      if (promptType === 'devotional') {
        instruction = `Você é um mentor cristão sábio (estilo Max Lucado/Rodovalho). O usuário leu: ${readingRef}. Gere uma mensagem devocional CURTA (max 3 frases), simples, encorajadora e focada em vitória/fé. Português.`;
      } else {
        instruction = `Você é um professor de escola bíblica. O usuário leu: ${readingRef}. Explique o contexto histórico/cultural dessa passagem de forma muito simples e curiosa (max 3 pontos breves). Português.`;
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: instruction }] }] })
        }
      );

      if (!response.ok) throw new Error('Erro na API');
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      setAiInsight(text || "Sem resposta no momento.");
    } catch (error) {
      console.error(error);
      setAiInsight("Não foi possível conectar com a inspiração agora. Tente novamente.");
    } finally {
      setAiLoading(false);
    }
  };

  // Auth & Data Load
  useEffect(() => {
    if (!auth) return;
    // @ts-ignore
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const docRef = doc(db, 'artifacts', appId, 'users', currentUser.uid, 'data', 'profile');
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            const data = snap.data();
            setUserName(data.name || currentUser.displayName || "Usuário");
            setCompletedDays(data.completedDays || []);
            setSavedReflections(data.reflections || {});
            setStreak(data.completedDays?.length || 0);
          } else {
             setUserName(currentUser.displayName || "Novo Usuário");
          }
        } catch (e) {
          console.log("Erro de leitura", e);
        }
      } else {
        // Tenta login anonimo apenas se não tiver user (removido para forçar email/senha ou anonimo manual se quisesse, mas aqui queremos email)
        // Se quiser voltar o anonimo automático, descomente:
        signInAnonymously(auth).catch(() => {});
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Leaderboard Listener
  useEffect(() => {
    if (!db || !user) return;
    const q = collection(db, 'artifacts', appId, 'public', 'data', 'leaderboard');
    // @ts-ignore
    const unsub = onSnapshot(q, (snapshot) => {
      const entries: any[] = [];
      snapshot.forEach((doc) => {
        const d = doc.data();
        entries.push({ uid: doc.id, name: d.name || "Anônimo", count: d.count || 0 });
      });
      entries.sort((a, b) => b.count - a.count);
      setLeaderboard(entries);
    });
    return () => unsub();
  }, [user]);

  // Clear AI on day change
  useEffect(() => { setAiInsight(null); }, [viewDay]);

  // Handlers
  const toggleComplete = async (day: any) => {
    if (!user || !userName) return;
    let newCompleted;
    if (completedDays.includes(day)) {
      newCompleted = completedDays.filter(d => d !== day);
    } else {
      newCompleted = [...completedDays, day];
      const dData = rawPlanData.find(d => d.day === day);
      if (dData?.isBookEnd) {
        setModalContent({ title: "Livro Concluído! 🏆", body: `Parabéns! Você terminou ${dData.book}.` });
        setShowModal(true);
      }
    }
    setCompletedDays(newCompleted);
    setStreak(newCompleted.length);
    try {
      await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'data', 'profile'), { completedDays: newCompleted }, { merge: true });
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'leaderboard', user.uid), { name: userName, count: newCompleted.length, lastUpdate: serverTimestamp() }, { merge: true });
    } catch (e) { console.error(e); }
  };

  const saveReflection = async () => {
    if (!user) return;
    const newRefs = { ...savedReflections, [viewDay]: reflectionInput };
    setSavedReflections(newRefs);
    try {
      await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'data', 'profile'), { reflections: newRefs }, { merge: true });
      alert("Salvo com sucesso! 🙏");
    } catch (e) { alert("Erro ao salvar."); }
  };

  // Renderização
  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-amber-500"><Flame className="animate-bounce" size={48} /></div>;

  if (!user || user.isAnonymous) {
    // Se for anônimo (entrou direto sem senha), mostra tela de perfil ou incentivo? 
    // Na verdade, o código acima tenta logar anônimo. Se queremos só email/senha, precisamos mostrar a tela de login.
    // Mas se o usuário JÁ entrou anônimo, ele pode usar. 
    // Vou simplificar: Se não tem NOME (userName), mostra a tela de login/cadastro.
  }

  if (!user || (user.isAnonymous && !userName)) {
     // Mostra login
     return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
        <div className="bg-slate-900 border border-slate-700 p-8 rounded-xl max-w-md w-full shadow-2xl">
          <BookOpen size={48} className="text-amber-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white mb-2">Jornada 90 Dias</h1>
          <p className="text-slate-400 mb-8">Novo Testamento</p>
          
          <div className="flex border-b border-slate-700 mb-6">
            <button 
              onClick={() => {setIsLoginView(true); setAuthError("");}} 
              className={`flex-1 pb-2 font-bold text-sm ${isLoginView ? 'text-amber-500 border-b-2 border-amber-500' : 'text-slate-500'}`}
            >
              JÁ TENHO CONTA
            </button>
            <button 
              onClick={() => {setIsLoginView(false); setAuthError("");}} 
              className={`flex-1 pb-2 font-bold text-sm ${!isLoginView ? 'text-amber-500 border-b-2 border-amber-500' : 'text-slate-500'}`}
            >
              CRIAR CONTA
            </button>
          </div>

          <div className="space-y-4">
            {!isLoginView && (
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 text-slate-500" size={18} />
                <input type="text" placeholder="Seu Nome Completo" className="w-full bg-slate-950 border border-slate-700 text-white pl-10 p-3 rounded-lg focus:border-amber-500 outline-none" value={inputName} onChange={(e) => setInputName(e.target.value)} />
              </div>
            )}
            
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-500" size={18} />
              <input type="email" placeholder="Seu E-mail" className="w-full bg-slate-950 border border-slate-700 text-white pl-10 p-3 rounded-lg focus:border-amber-500 outline-none" value={inputEmail} onChange={(e) => setInputEmail(e.target.value)} />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-500" size={18} />
              <input type="password" placeholder="Sua Senha" className="w-full bg-slate-950 border border-slate-700 text-white pl-10 p-3 rounded-lg focus:border-amber-500 outline-none" value={inputPassword} onChange={(e) => setInputPassword(e.target.value)} />
            </div>

            {authError && <p className="text-red-400 text-xs text-left bg-red-900/20 p-2 rounded border border-red-900">{authError}</p>}

            <button onClick={handleAuth} className="w-full bg-amber-700 hover:bg-amber-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 mt-2">
              {isLoginView ? <><LogIn size={18} /> Entrar</> : <><UserPlus size={18} /> Cadastrar</>}
            </button>
            
            <div className="mt-4 pt-4 border-t border-slate-800">
               <button onClick={() => {signInAnonymously(auth);}} className="text-xs text-slate-500 hover:text-slate-300 underline">Quero entrar sem cadastro (Acesso temporário)</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Se o usuário entrou mas não tem nome (Anônimo novo), pede nome
  if (!userName && user) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
            <div className="bg-slate-900 border border-slate-700 p-8 rounded-xl max-w-md w-full shadow-2xl">
                <h1 className="text-xl font-bold text-white mb-4">Bem-vindo!</h1>
                <p className="text-slate-400 mb-4">Como você gostaria de ser chamado?</p>
                <input type="text" placeholder="Seu nome" className="w-full bg-slate-950 border border-slate-700 text-white p-3 rounded-lg mb-4" value={tempName} onChange={(e) => setTempName(e.target.value)} />
                <button onClick={async () => {
                    if(!tempName.trim()) return;
                    setLoading(true);
                    await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'data', 'profile'), {
                        name: tempName, completedDays: [], createdAt: serverTimestamp()
                    }, { merge: true });
                    await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'leaderboard', user.uid), {
                        name: tempName, count: 0, lastUpdate: serverTimestamp()
                    }, { merge: true });
                    setUserName(tempName);
                    setLoading(false);
                }} className="w-full bg-amber-700 text-white py-3 rounded font-bold">Continuar</button>
            </div>
        </div>
      )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans pb-24">
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-lg">
        <div className="max-w-md mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-amber-500">JORNADA 90 DIAS</h1>
            <p className="text-xs text-slate-500 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> {userName} {user.isAnonymous && "(Visitante)"}</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
              <Flame size={16} className={streak > 0 ? "text-orange-500" : "text-slate-600"} />
              <span className="font-mono font-bold text-sm">{streak}</span>
            </div>
            <button onClick={handleLogout} className="text-slate-500 hover:text-red-400"><LogOut size={20} /></button>
          </div>
        </div>
      </header>

      {currentView === 'dashboard' && (
        <main className="max-w-md mx-auto px-4 py-6 space-y-8 animate-in slide-in-from-bottom-2">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-400 text-sm">DIA {activeDayData.day}/90</span>
                <span className="text-amber-500 font-bold text-xs bg-amber-950/30 px-2 py-1 rounded border border-amber-900/50">
                  {new Date(startDate.getTime() + (activeDayData.day - 1) * 86400000).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'})}
                </span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-1">{activeDayData.book}</h2>
              <p className="text-xl text-amber-500 mb-6">{activeDayData.ref.replace(activeDayData.book, '').trim()}</p>
              <ProgressBar current={completedDays.length} total={90} />
            </div>
          </div>

          <div className="flex items-center justify-between bg-slate-900/50 p-2 rounded-lg border border-slate-800">
            <button onClick={() => setViewDay(d => Math.max(1, d - 1))} disabled={viewDay === 1} className="p-2 hover:bg-slate-800 rounded text-slate-400 disabled:opacity-30"><ChevronLeft /></button>
            <span className="font-mono font-bold text-slate-300 text-sm">Navegar pelos Dias</span>
            <button onClick={() => setViewDay(d => Math.min(90, d + 1))} disabled={viewDay === 90} className="p-2 hover:bg-slate-800 rounded text-slate-400 disabled:opacity-30"><ChevronRight /></button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-amber-500"><Heart size={20} /><h3 className="font-bold text-lg">Palavra de Encorajamento</h3></div>
            <div className="bg-slate-900 p-6 rounded-lg border-l-4 border-amber-600 shadow-lg relative">
               <p className="text-lg leading-relaxed text-slate-300 italic relative z-10">"{aiInsight ? aiInsight : getStaticReflection()}"</p>
               {aiInsight && <div className="absolute top-0 right-0 p-2 opacity-20 text-amber-500"><Sparkles size={40} /></div>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => callGemini('devotional')} disabled={aiLoading} className="bg-indigo-900/40 border border-indigo-700/50 text-indigo-300 py-3 rounded-lg flex flex-col items-center justify-center gap-1">
                {aiLoading ? <Flame className="animate-spin" size={20} /> : <Heart size={20} />} <span className="text-xs font-bold uppercase">Mensagem de Fé</span>
              </button>
              <button onClick={() => callGemini('context')} disabled={aiLoading} className="bg-emerald-900/30 border border-emerald-700/50 text-emerald-300 py-3 rounded-lg flex flex-col items-center justify-center gap-1">
                 {aiLoading ? <Flame className="animate-spin" size={20} /> : <ScrollText size={20} />} <span className="text-xs font-bold uppercase">Curiosidades</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
             <label className="block text-sm font-medium text-slate-400 uppercase">Seu Diário de Fé</label>
             <textarea className="w-full bg-slate-900 border border-slate-700 rounded-lg p-4 text-slate-200" rows={4} placeholder="O que Deus falou com você hoje?" value={savedReflections[viewDay] || reflectionInput} onChange={(e) => setReflectionInput(e.target.value)} />
             <button onClick={saveReflection} className="text-xs text-amber-600 font-bold uppercase flex items-center gap-1"><CheckCircle size={14} /> Salvar Anotação</button>
          </div>

          <button onClick={() => toggleComplete(activeDayData.day)} className={`w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center space-x-3 shadow-lg ${isCompleted ? 'bg-green-900/30 text-green-500 border border-green-800' : 'bg-gradient-to-r from-amber-700 to-amber-800 text-white'}`}>
            {isCompleted ? <><CheckCircle className="w-6 h-6" /><span>Leitura Concluída</span></> : <><BookOpen className="w-6 h-6" /><span>Marcar como Lido</span></>}
          </button>

          {user?.isAnonymous && (
            <div className="mt-8 p-4 border border-yellow-800/50 bg-yellow-900/10 rounded-lg flex items-start gap-3">
              <ShieldCheck className="text-yellow-500 shrink-0" size={20} />
              <div>
                <h4 className="text-sm font-bold text-yellow-500">Modo Visitante</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Se você limpar o celular, perderá seus dados. Para salvar de verdade, saia e crie uma conta com e-mail e senha.
                </p>
              </div>
            </div>
          )}

        </main>
      )}

      {currentView === 'plan' && (
        <main className="max-w-md mx-auto px-4 py-6 animate-in slide-in-from-right">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><Calendar className="text-amber-500" /> Cronograma</h2>
          <div className="space-y-3">
            {rawPlanData.map((day) => {
              const isDone = completedDays.includes(day.day);
              const isCurrent = day.day === activeDayNumber;
              return (
                <div key={day.day} onClick={() => { setViewDay(day.day); setCurrentView('dashboard'); }} className={`p-4 rounded-lg border flex items-center justify-between cursor-pointer ${isCurrent ? 'bg-amber-900/20 border-amber-700/50' : isDone ? 'bg-slate-900/50 border-slate-800 opacity-60' : 'bg-slate-900 border-slate-800'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isDone ? 'bg-green-900 text-green-400' : 'bg-slate-800 text-slate-400'}`}>{day.day}</div>
                    <div><h4 className={`font-bold ${isDone ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{day.book}</h4><p className="text-xs text-slate-500">{day.ref}</p></div>
                  </div>
                  <div className="flex items-center gap-2">{day.isBookEnd && <Users size={14} className="text-amber-500" />}{isDone && <CheckCircle size={16} className="text-green-500" />}</div>
                </div>
              );
            })}
          </div>
        </main>
      )}

      {currentView === 'ranking' && (
        <main className="max-w-md mx-auto px-4 py-6 animate-in slide-in-from-right">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Trophy className="text-amber-500" /> Ranking</h2>
            <div className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Ao vivo</div>
          </div>
          <div className="space-y-4">
            {leaderboard.length === 0 ? <div className="text-center py-10 text-slate-500 bg-slate-900/30 rounded-xl border border-dashed border-slate-800"><p>Nenhum participante ainda...</p></div> : 
              leaderboard.map((entry: any, index) => (
                <div key={entry.uid} className={`bg-slate-900 p-4 rounded-xl border ${entry.uid === user?.uid ? 'border-amber-800/50 ring-1 ring-amber-500' : 'border-slate-800'} flex items-center justify-between relative overflow-hidden`}>
                   {entry.uid === user?.uid && <div className="absolute top-0 right-0 bg-amber-600 text-[10px] text-white px-2 rounded-bl font-bold">VOCÊ</div>}
                  <div className="flex items-center gap-4">
                    <div className={`w-8 text-xl font-bold text-center ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-amber-700' : 'text-slate-400'}`}>{index < 3 ? ['🥇','🥈','🥉'][index] : `#${index + 1}`}</div>
                    <div><h3 className={`font-bold ${entry.uid === user?.uid ? 'text-amber-400' : 'text-slate-200'}`}>{entry.name}</h3><p className="text-xs text-slate-500 flex items-center gap-1"><BookOpen size={10} /> {entry.count} leituras</p></div>
                  </div>
                  <div className="flex flex-col items-end"><span className="text-2xl font-bold text-white">{entry.count}</span><span className="text-[10px] text-slate-500 uppercase">Pontos</span></div>
                </div>
              ))
            }
          </div>
        </main>
      )}

      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 pb-safe z-40 shadow-2xl">
        <div className="max-w-md mx-auto flex justify-around p-4">
          <button onClick={() => setCurrentView('dashboard')} className={`flex flex-col items-center space-y-1 ${currentView === 'dashboard' ? 'text-amber-500 scale-110' : 'text-slate-600'}`}><Target size={24} /><span className="text-[10px] uppercase font-bold tracking-widest">Hoje</span></button>
          <button onClick={() => setCurrentView('plan')} className={`flex flex-col items-center space-y-1 ${currentView === 'plan' ? 'text-amber-500 scale-110' : 'text-slate-600'}`}><Calendar size={24} /><span className="text-[10px] uppercase font-bold tracking-widest">Plano</span></button>
          <button onClick={() => setCurrentView('ranking')} className={`flex flex-col items-center space-y-1 ${currentView === 'ranking' ? 'text-amber-500 scale-110' : 'text-slate-600'}`}><Trophy size={24} /><span className="text-[10px] uppercase font-bold tracking-widest">Ranking</span></button>
        </div>
      </nav>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={modalContent.title}><p className="whitespace-pre-line">{modalContent.body}</p></Modal>
    </div>
  );
}