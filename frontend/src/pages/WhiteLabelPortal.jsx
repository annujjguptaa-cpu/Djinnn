import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import { API_BASE } from '../config'
import { Upload, ShieldCheck, Rocket, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

const WhiteLabelPortal = () => {
    const { linkId } = useParams()
    const [config, setConfig] = useState(null)
    const [step, setStep] = useState(1) // 1: Upload, 2: Push, 3: Success
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        const user = new URLSearchParams(window.location.search).get('user')
        if (user) setIsConnected(true)
        
        // Fetch link metadata (mocked for demo logic)
        setConfig({
            portal_name: "Engineering Submission Portal",
            custom_logo_url: null,
            workflow_name: "Hackathon 2026 Core",
            type: "workflow" // workflow, fork, or org
        })
    }, [linkId])

    const handleAction = async () => {
        if (!isConnected) {
            window.location.href = `${API_BASE}/auth/github/login?state=${linkId}`
            return
        }
        
        setLoading(true)
        try {
            const res = await axios.post(`${API_BASE}/auth/github/link/execute`, {
                link_id: linkId,
                user_id: 'recipient_id', // Flowing from auth
                path: 'C:\\Users\\ASUS\\OneDrive\\Desktop\\Djinn' // Manual select fallback
            })
            setResult(res.data)
            setStep(3)
        } catch (e) {
            console.error("Execution failed", e)
        }
        setLoading(false)
    }

    if (!config) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="animate-spin text-gray-400" /></div>

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-100">
            {/* Clean, Non-Branded Header */}
            <header className="bg-white border-b border-gray-200 py-6">
                <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {config.custom_logo_url ? (
                            <img src={config.custom_logo_url} alt="Portal Logo" className="h-10 w-auto" />
                        ) : (
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200 text-gray-400">
                                <ShieldCheck size={24} />
                            </div>
                        )}
                        <h1 className="text-xl font-bold tracking-tight text-gray-800">{config.portal_name}</h1>
                    </div>
                    <div className="text-xs font-medium text-gray-400 uppercase tracking-widest">
                        SECURE SUBMISSION CHANNEL
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-6 py-16">
                <StepIndicator current={step} />

                <div className="bg-white rounded-3xl border border-gray-200 p-12 shadow-sm">
                    {step === 1 && (
                        <div className="text-center">
                            <h2 className="text-3xl font-extrabold mb-4">
                                {config.type === 'fork' ? "Fork Repository" : config.type === 'org' ? "Join Organization" : "Submit Your Project"}
                            </h2>
                            <p className="text-gray-500 mb-12">
                                {config.type === 'workflow' 
                                    ? `Your project will be validated against **${config.workflow_name}** standards before pushing.`
                                    : `Accept the invitation to receive access to the **${config.workflow_name}** resources.`
                                }
                            </p>

                            {config.type === 'workflow' && (
                                <div className="border-2 border-dashed border-gray-200 rounded-3xl p-16 hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group mb-12">
                                    <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-100 text-gray-400 group-hover:text-blue-500 transition-colors">
                                        <Upload size={32} />
                                    </div>
                                    <div className="font-bold text-lg mb-2">Drop your project folder here</div>
                                    <div className="text-sm text-gray-400">or click to browse from your device</div>
                                </div>
                            )}

                            <button onClick={handleAction} className="w-full py-5 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-3">
                                {isConnected ? (
                                    <>
                                        <Rocket size={20} /> 
                                        {config.type === 'fork' ? "Execute Fork" : config.type === 'org' ? "Join Now" : "Deploy via Portal"}
                                    </>
                                ) : (
                                    <>Connect GitHub Identity</>
                                )}
                            </button>
                        </div>
                    )}

                    {step === 3 && result && (
                        <div className="text-center">
                            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 text-green-500 border border-green-100">
                                <CheckCircle size={48} />
                            </div>
                            <h2 className="text-4xl font-extrabold mb-3">Submission Success</h2>
                            <p className="text-gray-500 mb-12 italic">Your project has been standardized and pushed to GitHub.</p>
                            
                            <div className="grid gap-4">
                                <a href={result.repo_url} target="_blank" className="w-full py-5 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3">
                                    View Repository
                                </a>
                                <div className="text-xs text-gray-400 text-center uppercase tracking-widest font-semibold flex items-center justify-center gap-2">
                                    <ShieldCheck size={14} /> Compliance Verified on {new Date().toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {loading && (
                <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                    <Loader2 className="animate-spin text-gray-900 mb-6" size={64} />
                    <div className="text-xl font-bold tracking-tight text-gray-800">VALIDATING & DEPLOYING...</div>
                </div>
            )}
        </div>
    )
}

const StepIndicator = ({ current }) => (
    <div className="flex items-center justify-between mb-12 px-20">
        {[1, 2, 3].map(i => (
            <div key={i} className={`h-2 rounded-full transition-all duration-500 ${current >= i ? 'bg-gray-900 w-1/4' : 'bg-gray-200 w-1/6'}`} />
        ))}
    </div>
)

export default WhiteLabelPortal
