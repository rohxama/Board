import { useState, useEffect } from 'react'

const COOKIE_STORAGE_KEY = 'diagram-board-cookie-consent'

const CONSENTChoices = {
  ACCEPT_ALL: 'accept_all',
  REJECT_NON_ESSENTIAL: 'reject_non_essential',
  MANAGE: 'manage',
}

function getStoredConsent() {
  try {
    const stored = localStorage.getItem(COOKIE_STORAGE_KEY)
    if (stored && typeof stored === 'string') {
      return JSON.parse(stored)
    }
  } catch {
    // Storage unavailable or corrupted
  }
  return null
}

function storeConsent(consent) {
  try {
    localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify({
      choice: consent,
      timestamp: Date.now(),
    }))
  } catch {
    // Storage unavailable
  }
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)

  useEffect(() => {
    const consent = getStoredConsent()
    if (!consent || !consent.choice) {
      setVisible(true)
    }
  }, [])

  const handleAcceptAll = () => {
    storeConsent(CONSENTChoices.ACCEPT_ALL)
    setVisible(false)
  }

  const handleRejectNonEssential = () => {
    storeConsent(CONSENTChoices.REJECT_NON_ESSENTIAL)
    setVisible(false)
  }

  const handleManagePreferences = () => {
    setShowPreferences(true)
  }

  const handleSavePreferences = (preferences) => {
    storeConsent({ choice: CONSENTChoices.MANAGE, preferences })
    setShowPreferences(false)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <>
      <div className="cookie-consent-bar">
        <div className="cookie-consent-content">
          <p className="cookie-consent-message">
            We use cookies to improve your experience and support analytics & marketing.
          </p>
          <div className="cookie-consent-actions">
            <button
              type="button"
              className="cookie-btn cookie-btn-accept"
              onClick={handleAcceptAll}
            >
              Accept All
            </button>
            <button
              type="button"
              className="cookie-btn cookie-btn-reject"
              onClick={handleRejectNonEssential}
            >
              Reject Non-Essential
            </button>
            <button
              type="button"
              className="cookie-btn cookie-btn-manage"
              onClick={handleManagePreferences}
            >
              Manage Preferences
            </button>
          </div>
        </div>
      </div>

      {showPreferences && (
        <CookiePreferencesPanel
          onSave={handleSavePreferences}
          onCancel={() => setShowPreferences(false)}
        />
      )}
    </>
  )
}

function CookiePreferencesPanel({ onSave, onCancel }) {
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    marketing: false,
  })

  const handleToggle = (type) => {
    if (type === 'essential') return // Essential cookies cannot be disabled
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type],
    }))
  }

  return (
    <div className="cookie-preferences-overlay">
      <div className="cookie-preferences-panel">
        <h3>Cookie Preferences</h3>
        <div className="cookie-preferences-options">
          <label className="cookie-preference-item">
            <input
              type="checkbox"
              checked={preferences.essential}
              disabled
              readOnly
            />
            <span className="cookie-preference-label">
              <strong>Essential</strong>
              <span>Required for the website to function properly.</span>
            </span>
          </label>
          <label className="cookie-preference-item">
            <input
              type="checkbox"
              checked={preferences.analytics}
              onChange={() => handleToggle('analytics')}
            />
            <span className="cookie-preference-label">
              <strong>Analytics</strong>
              <span>Help us understand how visitors interact with the website.</span>
            </span>
          </label>
          <label className="cookie-preference-item">
            <input
              type="checkbox"
              checked={preferences.marketing}
              onChange={() => handleToggle('marketing')}
            />
            <span className="cookie-preference-label">
              <strong>Marketing</strong>
              <span>Used to deliver personalized advertisements.</span>
            </span>
          </label>
        </div>
        <div className="cookie-preferences-actions">
          <button
            type="button"
            className="cookie-btn cookie-btn-manage"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="cookie-btn cookie-btn-accept"
            onClick={() => onSave(preferences)}
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  )
}
