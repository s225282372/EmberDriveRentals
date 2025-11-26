const Home = () => {
  return (
    <div>
      {/* Hero Section with Background */}
      <div 
        className="relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2000')",
          minHeight: '600px'
        }}
      >
        <div className="container-custom py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              INDULGE YOUR
              <br />
              <span className="text-primary-400">SENSES</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              Discover the ultimate in luxury car rentals with EmberDrive. With a focus on exceptional customer service and an unrivaled fleet of premium vehicles, we're dedicated to delivering an unforgettable rental experience.
            </p>
            <button className="btn btn-primary btn-lg">
              SELECT YOUR VEHICLE
            </button>
          </div>
        </div>
      </div>

      {/* Vehicle Categories */}
      <div className="container-custom py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          SELECT YOUR VEHICLE
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="card card-clickable text-center group">
            <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=400" 
                alt="Sedan"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">SEDAN</h3>
          </div>

          <div className="card card-clickable text-center group">
            <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=400" 
                alt="SUV"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">SUV</h3>
          </div>

          <div className="card card-clickable text-center group">
            <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=400" 
                alt="Convertible"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">CABRIOLET</h3>
          </div>

          <div className="card card-clickable text-center group">
            <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=400" 
                alt="Performance"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">PERFORMANCE</h3>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-gray-50 py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚗</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Fleet</h3>
              <p className="text-gray-600">Choose from hundreds of premium vehicles</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
              <p className="text-gray-600">Competitive rates with no hidden fees</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Booking</h3>
              <p className="text-gray-600">Book your car in just a few clicks</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

