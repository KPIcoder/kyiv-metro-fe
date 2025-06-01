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
      <div className="relative flex flex-col gap-2 bg-gradient-to-br from-yellow-50 to-white border-2 border-yellow-300 rounded-xl shadow-lg overflow-hidden min-h-[170px] p-5">
        {children}
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
      className="px-5 py-2 bg-yellow-400 text-yellow-900 font-bold rounded-lg shadow hover:bg-yellow-500 transition disabled:opacity-50"
      onClick={onClick}
      disabled={disabled}
    >
      Buy
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