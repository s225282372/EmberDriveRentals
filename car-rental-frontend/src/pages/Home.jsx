const Home = () => {
  return (
    <div>
      {/* Hero Section with Background */}
      <div 
        className="relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2000')",
          minHeight: '650px'
        }}
      >
        <div className="container-custom py-32 md:py-40">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              ELEVATE YOUR
              <br />
              <span className="text-primary-400">JOURNEY</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed max-w-2xl">
              Experience the thrill of driving premium vehicles. From luxury sedans to high-performance sports cars, find your perfect ride and create unforgettable memories on the road.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="btn btn-primary btn-lg shadow-xl hover:shadow-2xl transition-shadow">
                EXPLORE OUR FLEET
              </button>
              <button className="btn btn-outline text-white border-white hover:bg-white hover:text-gray-900 btn-lg">
                HOW IT WORKS
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* Vehicle Categories */}
      <div className="container-custom py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            CHOOSE YOUR EXPERIENCE
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select from our curated collection of premium vehicles, each offering a unique driving experience tailored to your style.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="card card-clickable text-center group hover:border-primary-400 transition-all">
            <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=400" 
                alt="Sedan"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">SEDAN</h3>
            <p className="text-sm text-gray-500 mt-1">Comfort & Elegance</p>
          </div>

          <div className="card card-clickable text-center group hover:border-primary-400 transition-all">
            <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=400" 
                alt="SUV"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">SUV</h3>
            <p className="text-sm text-gray-500 mt-1">Space & Power</p>
          </div>

          <div className="card card-clickable text-center group hover:border-primary-400 transition-all">
            <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=400" 
                alt="Convertible"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">CONVERTIBLE</h3>
            <p className="text-sm text-gray-500 mt-1">Freedom & Style</p>
          </div>

          <div className="card card-clickable text-center group hover:border-primary-400 transition-all">
            <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=400" 
                alt="Performance"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">PERFORMANCE</h3>
            <p className="text-sm text-gray-500 mt-1">Speed & Adrenaline</p>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-20">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              WHY CHOOSE EMBERDRIVE
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to providing an exceptional rental experience from start to finish.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Premium Selection</h3>
              <p className="text-gray-600">
                Every vehicle in our fleet is meticulously maintained and hand-picked for quality and performance.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Transparent Pricing</h3>
              <p className="text-gray-600">
                No hidden fees, no surprises. What you see is what you pay, with competitive rates across our entire fleet.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Instant Booking</h3>
              <p className="text-gray-600">
                Book online in minutes with our seamless platform. Get on the road faster with instant confirmations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container-custom py-20">
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of satisfied customers who trust EmberDrive for their rental needs.
          </p>
          <button className="btn bg-white text-primary-600 hover:bg-gray-100 btn-lg shadow-xl">
            GET STARTED TODAY
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;