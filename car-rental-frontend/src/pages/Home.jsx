import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="font-sans">
      {/* Hero Section with Premium Background */}
      <div 
        className="relative bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{
          backgroundImage: "linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(220, 38, 38, 0.3) 50%, rgba(0, 0, 0, 0.8) 100%), url('https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2400')",
          minHeight: '100vh'
        }}
      >
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-transparent to-black/40 animate-pulse" style={{ animationDuration: '8s' }}></div>
        
        <div className="container-custom relative z-10 py-32 md:py-48">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-block mb-6 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
              <span className="text-white text-sm font-medium tracking-wider">PREMIUM LUXURY RENTALS</span>
            </div>

            {/* Main Heading with custom font */}
            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-none tracking-tight" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              DRIVE
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-red-600 animate-gradient">
                EXTRAORDINARY
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-200 mb-10 leading-relaxed max-w-2xl font-light">
              Experience automotive excellence with our handpicked collection of premium vehicles. Every drive is an adventure waiting to happen.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/cars">
                <button className="btn btn-primary btn-lg shadow-2xl hover:shadow-red-500/50 hover:scale-105 transition-all duration-300 group">
                  <span className="mr-2">EXPLORE FLEET</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </Link>
              <button className="btn btn-outline text-white border-2 border-white/50 hover:bg-white hover:text-gray-900 btn-lg backdrop-blur-sm hover:scale-105 transition-all duration-300">
                HOW IT WORKS
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>500+</div>
                <div className="text-sm text-gray-300 uppercase tracking-wider">Premium Cars</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>50K+</div>
                <div className="text-sm text-gray-300 uppercase tracking-wider">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>4.9★</div>
                <div className="text-sm text-gray-300 uppercase tracking-wider">Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center gap-2">
            <span className="text-white text-xs uppercase tracking-widest">Scroll</span>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Vehicle Categories */}
      <div className="container-custom py-24 bg-white">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black text-gray-900 mb-4 tracking-tight" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            CHOOSE YOUR DRIVE
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-orange-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
            Every category tells a story. Find yours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { name: 'LUXURY SEDAN', desc: 'Elegance Redefined', img: 'https://images.unsplash.com/photo-1563720223809-1eb0e64c6f70?q=80&w=800' },
            { name: 'POWER SUV', desc: 'Dominate Every Road', img: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=800' },
            { name: 'EXOTIC SPORTS', desc: 'Pure Adrenaline', img: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=800' },
            { name: 'SUPERCAR', desc: 'Beyond Limits', img: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800' }
          ].map((category, idx) => (
            <div key={idx} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div className="aspect-[4/5] bg-gray-900">
                  <img 
                    src={category.img}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-1 tracking-tight" style={{ fontFamily: "'Montserrat', sans-serif" }}>{category.name}</h3>
                  <p className="text-gray-300 text-sm font-light">{category.desc}</p>
                  <div className="mt-4 flex items-center text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-sm font-medium">Explore</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Us with Glassmorphism */}
      <div className="relative py-24 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-red-900/20 to-gray-900"></div>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        
        <div className="container-custom relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-white mb-4 tracking-tight" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              WHY EMBERDRIVE
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-orange-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light">
              Excellence in every detail. Luxury in every mile.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
                title: 'Curated Excellence',
                desc: 'Every vehicle is meticulously inspected, detailed, and maintained to the highest standards. We don\'t just rent cars—we deliver experiences.'
              },
              { 
                icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
                title: 'Crystal Clear Pricing',
                desc: 'Zero surprises, zero hidden fees. What you see is exactly what you pay. Premium quality shouldn\'t come with premium confusion.'
              },
              { 
                icon: 'M13 10V3L4 14h7v7l9-11h-7z',
                title: 'Instant Freedom',
                desc: 'Book in 60 seconds, drive in 60 minutes. Our seamless platform gets you behind the wheel faster than ever before.'
              }
            ].map((feature, idx) => (
              <div key={idx} className="group">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:border-red-500/50 shadow-xl">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-red-500/50">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>{feature.title}</h3>
                  <p className="text-gray-100 leading-relaxed text-base">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container-custom py-24">
        <div className="relative overflow-hidden bg-gradient-to-br from-red-600 via-red-700 to-orange-600 rounded-3xl p-16 text-center text-white shadow-2xl">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '50px 50px' }}></div>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Ready to Ignite Your Drive?
            </h2>
            <p className="text-2xl mb-10 text-red-100 font-light max-w-2xl mx-auto">
              Join thousands who've discovered the EmberDrive difference.
            </p>
            <Link to="/cars">
              <button className="btn bg-white text-red-600 hover:bg-gray-100 btn-lg shadow-2xl hover:scale-110 transition-all duration-300 font-bold">
                START YOUR JOURNEY
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Add custom font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=Inter:wght@300;400;500;600&display=swap');
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;