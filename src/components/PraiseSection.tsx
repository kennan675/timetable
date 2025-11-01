export const PraiseSection = () => {
  return (
    <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8 shadow-xl">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Praise</h2>
      
      <div className="flex justify-center">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity animate-pulse" />
          <img 
            src="https://d64gsuwffb70l.cloudfront.net/689d6fc2a501c25bc06adda5_1762001549167_0992f25a.png"
            alt="Praise"
            className="relative w-64 h-64 md:w-80 md:h-80 rounded-full object-cover border-4 border-white shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
};
