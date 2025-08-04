import ReceiptEntryForm from '@/components/ReceiptEntryForm'

export default function ReceiptEntryPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Receipt Entry</h1>
        <p className="text-gray-600 mb-6">
          Enter receipt details for building collections. Select building and flat to auto-populate resident information.
        </p>
        <ReceiptEntryForm />
      </div>
    </div>
  )
}
