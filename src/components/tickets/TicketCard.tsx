import { ReactNode, createContext, useContext, useState } from 'react'
import QRCode from 'react-qr-code'

interface TicketCardContextType {
  showQrCode: boolean
  setShowQrCode: (show: boolean) => void
}

const TicketCardContext = createContext<TicketCardContextType | undefined>(undefined)

function useTicketCardContext() {
  const ctx = useContext(TicketCardContext)
  if (!ctx) throw new Error('TicketCard compound components must be used within <TicketCard>')
  return ctx
}

interface TicketCardProps {
  children: ReactNode
  qrValue?: string
}

function TicketCard({ children, qrValue }: TicketCardProps) {
  const [showQrCode, setShowQrCode] = useState(false)
 
  return (
    <TicketCardContext.Provider value={{ showQrCode, setShowQrCode }}>
      <div className="relative flex flex-col gap-2 bg-gradient-to-br from-yellow-50 to-white border-2 border-yellow-300 rounded-xl shadow-lg overflow-hidden min-h-[170px] p-5 transition-transform hover:scale-[1.015] hover:shadow-2xl group">
        {/* Ticket stub effect */}
        <div className="absolute left-0 top-0 h-full flex items-center">
          <div className="h-full w-3 flex flex-col items-center justify-between">
            <span className="w-3 h-3 bg-yellow-200 rounded-full mt-1" />
            <span className="flex-1 border-l-2 border-dashed border-yellow-300 mx-auto" />
            <span className="w-3 h-3 bg-yellow-200 rounded-full mb-1" />
          </div>
        </div>
        <div className="pl-6 flex flex-col gap-2 flex-1">
          {children}
        </div>
        {qrValue && showQrCode && (
          <div className="bg-white p-2 rounded shadow border mt-2 flex flex-col items-center">
            <QRCode value={qrValue} size={96} />
            <button
              className="mt-2 text-xs text-blue-600 hover:underline"
              onClick={() => setShowQrCode(false)}
            >
              Hide QR code
            </button>
          </div>
        )}
      </div>
    </TicketCardContext.Provider>
  )
}

function Title({ title }: { title: string }) {
  return (
    <h3 className="font-extrabold text-xl text-yellow-900 tracking-wide">{title}</h3>
  )
}

function Description({ description }: { description: string }) {
  return <p className="text-sm text-yellow-800 mb-3 italic">{description}</p>
}

function Tag({ children }: { children: ReactNode }) {
  return <span className="bg-yellow-100 px-2 py-1 rounded text-xs font-medium text-yellow-900">{children}</span>
}

function BuyButton({ onClick, disabled }: { onClick: () => void, disabled?: boolean }) {
  return (
    <button
      className="px-6 py-2 bg-yellow-400 text-yellow-900 font-extrabold rounded-lg shadow-lg hover:bg-yellow-500 hover:scale-105 transition-all text-base tracking-wide border-2 border-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
      onClick={onClick}
      disabled={disabled}
    >
      <span className="inline-flex items-center gap-2">
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="inline-block text-yellow-900"><rect x="2" y="7" width="20" height="10" rx="3" /><path d="M16 3v4" /><path d="M8 3v4" /><path d="M2 17v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2" /></svg>
        Buy
      </span>
    </button>
  )
}

function QRButton({ onShowQRcode }: { onShowQRcode?: () => void }) {
  const { showQrCode, setShowQrCode } = useTicketCardContext()
  return !showQrCode ? (
    <button
      className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-xs font-medium"
      onClick={() => {
        setShowQrCode(true)
        if (onShowQRcode) onShowQRcode()
      }}
    >
      View QR code
    </button>
  ) : null
}

TicketCard.Title = Title
TicketCard.Description = Description
TicketCard.Tag = Tag
TicketCard.BuyButton = BuyButton
TicketCard.QRButton = QRButton

export { TicketCard } 