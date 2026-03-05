function WalletSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-200 h-24 rounded-xl" />
        ))}
      </div>

      <div className="bg-gray-200 h-64 rounded-xl" />
      <div className="bg-gray-200 h-64 rounded-xl" />
    </div>
  );
}

export default WalletSkeleton;