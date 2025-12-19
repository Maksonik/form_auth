import { useEffect, useMemo, useRef, useState } from 'react'
import { loginPayload, verifyCodePayload } from './api/mockAuth'
import './App.css'

const CompanyBadge = () => (
  <div className="company-badge" aria-label="Company logo">
    <div className="company-icon" />
    <span className="company-name">Company</span>
  </div>
)

const Toast = ({ message, variant = 'info', onClose }) => {
  useEffect(() => {
    const timeout = setTimeout(onClose, 3200)
    return () => clearTimeout(timeout)
  }, [onClose])

  return (
    <div className={`toast toast-${variant}`} role="status" aria-live="polite">
      <span className="toast-icon" aria-hidden="true">
        {variant === 'success' ? (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
              fill="currentColor"
              opacity="0.12"
            />
            <path
              d="m8.5 12 2.25 2.5L15.5 9"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"
              fill="currentColor"
              opacity="0.12"
            />
            <path
              d="M12 8.5v4.75"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <circle cx="12" cy="15.5" r="0.9" fill="currentColor" />
          </svg>
        )}
      </span>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={onClose} aria-label="Close notification">
        ×
      </button>
    </div>
  )
}

const InputField = ({ label, value, onChange, type = 'text', icon, onKeyDown }) => (
  <label className="field">
    <span className="field-label">{label}</span>
    <div className="input-shell">
      <span className="input-icon" aria-hidden="true">
        {icon}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={label}
        onKeyDown={onKeyDown}
      />
    </div>
  </label>
)

const LoginForm = ({ onSubmit, isLoading, error }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const disableSubmit = useMemo(
    () => !email || !password || isLoading,
    [email, password, isLoading],
  )

  const handleSubmit = () => {
    if (disableSubmit) return
    onSubmit(email, password)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !disableSubmit) {
      event.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="card" role="form" aria-labelledby="form-title">
      <CompanyBadge />
      <h1 id="form-title" className="panel-title">
        Sign in to your account to continue
      </h1>

      <div className="panel">
        <InputField
          label="Email"
          value={email}
          onChange={setEmail}
          type="email"
          icon={
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5z"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path
                d="m6.5 8 5 3.5a1.5 1.5 0 0 0 1.7 0L18 8"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
          onKeyDown={handleKeyDown}
        />
        <InputField
          label="Password"
          value={password}
          onChange={setPassword}
          type="password"
          icon={
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect
                x="5.5"
                y="10"
                width="13"
                height="9"
                rx="2.5"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path
                d="M8.5 10V8.5A3.5 3.5 0 0 1 12 5h0a3.5 3.5 0 0 1 3.5 3.5V10"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <circle cx="12" cy="14.5" r="1" fill="currentColor" />
              <path
                d="M12 15.5V17"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          }
          onKeyDown={handleKeyDown}
        />
        {error && <span className="error-message">{error}</span>}

        <button
          type="button"
          className="primary"
          disabled={disableSubmit}
          onClick={handleSubmit}
        >
          Log in
        </button>
      </div>
    </div>
  )
}

const CodeInput = ({ value, onChange, error, onEnter }) => {
  const inputRefs = useRef([])

  const digits = value.split('').slice(0, 6)
  while (digits.length < 6) {
    digits.push('')
  }

  const handleChange = (index, newValue) => {
    if (!/^\d*$/.test(newValue)) return

    const newDigits = [...digits]
    newDigits[index] = newValue.slice(-1)
    onChange(newDigits.join(''))

    if (newValue && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const updateDigits = (updater) => {
    const nextDigits = [...digits]
    updater(nextDigits)
    onChange(nextDigits.join(''))
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Enter' && onEnter) {
      e.preventDefault()
      onEnter()
      return
    }

    if (e.key === 'Backspace') {
      if (digits[index]) {
        updateDigits((nextDigits) => {
          nextDigits[index] = ''
        })
      } else if (index > 0) {
        updateDigits((nextDigits) => {
          nextDigits[index - 1] = ''
        })
        inputRefs.current[index - 1]?.focus()
      }
    }

    if (e.key === 'Delete') {
      if (digits[index]) {
        updateDigits((nextDigits) => {
          nextDigits[index] = ''
        })
      }
    }
  }

  return (
    <div className="code-input-container">
      <div className="code-input-wrapper">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={`code-digit ${error ? 'error' : ''}`}
          />
        ))}
      </div>
      {error && <span className="error-message">{error}</span>}
    </div>
  )
}

const TwoFactorForm = ({ onBack, onSubmit, isLoading, error }) => {
  const [code, setCode] = useState('')

  const disableSubmit = useMemo(() => code.length !== 6 || isLoading, [code, isLoading])

  const handleSubmit = () => {
    if (disableSubmit) return
    onSubmit(code)
  }

  return (
    <>
      <button className="back-button" onClick={onBack} aria-label="Go back">
        <span className="back-arrow">‹</span>
      </button>
      <div className="card" role="form" aria-labelledby="form-title">
        <CompanyBadge />
        <h1 id="form-title" className="panel-title">
          Two-Factor Authentication
        </h1>
        <p className="form-description">
          Enter the 6-digit code from the Google Authenticator app
        </p>

        <div className="panel">
          <CodeInput value={code} onChange={setCode} error={error} onEnter={handleSubmit} />

          <button
            type="button"
            className="primary"
            disabled={disableSubmit}
            onClick={handleSubmit}
          >
            Continue
          </button>
        </div>
      </div>
    </>
  )
}

function App() {
  const [step, setStep] = useState('login')
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [twoFAError, setTwoFAError] = useState('')
  const [toast, setToast] = useState(null)

  const showToast = (message, variant = 'info') => {
    setToast({ message, variant })
  }

  const handleLoginSubmit = async (email, password) => {
    setIsLoading(true)
    setLoginError('')

    try {
      await loginPayload({ email, password })
      setStep('2fa')
      showToast('Login accepted. Enter the verification code.', 'success')
    } catch (err) {
      setLoginError(err.message || 'Login failed')
      showToast(err.message || 'Login failed', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTwoFactorSubmit = async (code) => {
    setIsLoading(true)
    setTwoFAError('')

    try {
      const result = await verifyCodePayload({ code })
      if (result.success) {
        showToast('Authentication successful! Welcome back.', 'success')
        setStep('login')
        setTwoFAError('')
      }
    } catch (err) {
      setTwoFAError(err.message || 'Verification failed')
      showToast(err.message || 'Verification failed', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="page">
      <div className="toast-region" aria-live="polite" aria-atomic="true">
        {toast && (
          <Toast message={toast.message} variant={toast.variant} onClose={() => setToast(null)} />
        )}
      </div>
      {step === 'login' && (
        <LoginForm
          onSubmit={handleLoginSubmit}
          isLoading={isLoading}
          error={loginError}
        />
      )}
      {step === '2fa' && (
        <TwoFactorForm
          onBack={() => {
            setStep('login')
            setTwoFAError('')
          }}
          onSubmit={handleTwoFactorSubmit}
          isLoading={isLoading}
          error={twoFAError}
        />
      )}
    </main>
  )
}

export default App
