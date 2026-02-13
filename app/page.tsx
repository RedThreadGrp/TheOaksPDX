import { getSiteConfig, getFoodMenu, getDrinksMenu, getEvents } from '@/lib/content';
import OpenNowBadge from '@/components/OpenNowBadge';
import CTAButton from '@/components/CTAButton';
import { getTodayHours, formatHours } from '@/lib/hours';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  const siteConfig = getSiteConfig();
  const todayHours = getTodayHours(siteConfig.hours);
  const foodMenu = getFoodMenu();
  const drinksMenu = getDrinksMenu();

  // Featured menu items
  const featuredFood = [
    { name: 'The Totchos', description: 'Tater tots loaded with cheese, bacon, sour cream, and green onions', price: '$12' },
    { name: 'The Burger', description: 'Classic pub burger with lettuce, tomato, onion, and pickles', price: '$14' },
    { name: 'The Reuben', description: 'Corned beef, Swiss cheese, sauerkraut, and Thousand Island on rye', price: '$17' },
    { name: 'Fish & Chips', description: 'Beer-battered cod with fries and coleslaw', price: '$20' },
  ];

  const featuredDrinks = [
    { name: 'The Oaks Fashioned', description: 'Our take on the classic with bourbon and house-made bitters', price: '$11' },
    { name: 'The Bybee', description: 'Vodka, elderflower, and fresh citrus', price: '$12' },
    { name: 'Oregon Mule', description: 'Local vodka, ginger beer, and fresh lime', price: '$11' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Full Bleed */}
      <section className="relative h-[85vh] flex items-center justify-center bg-oak-brown overflow-hidden">
        {/* Background overlay for when we add image */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight">
            THE OAKS PUB PDX
          </h1>
          <p className="text-xl md:text-2xl text-cream mb-8 font-light">
            Neighborhood pub in Southeast Portland
          </p>
          
          <div className="flex justify-center mb-10">
            <OpenNowBadge hours={siteConfig.hours} />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
            <CTAButton href="/menu" variant="primary" className="w-full sm:w-auto">
              VIEW MENU
            </CTAButton>
            <CTAButton href={`https://maps.google.com/?q=${encodeURIComponent(siteConfig.address.street + ', ' + siteConfig.address.city)}`} variant="outline" className="w-full sm:w-auto">
              GET DIRECTIONS
            </CTAButton>
            {siteConfig.orderUrl && (
              <CTAButton href={siteConfig.orderUrl} variant="outline" className="w-full sm:w-auto">
                ORDER ONLINE
              </CTAButton>
            )}
          </div>
        </div>
      </section>

      {/* Quick Info Bar - Dark Strip */}
      <section className="bg-warm-charcoal text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <span className="text-3xl mb-2">📍</span>
              <p className="text-lg font-medium">
                {siteConfig.address.street}<br />
                {siteConfig.address.city}, {siteConfig.address.state} {siteConfig.address.zip}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl mb-2">📞</span>
              <a href={`tel:${siteConfig.phone}`} className="text-lg font-medium text-gold hover:text-white transition-colors">
                {siteConfig.phone}
              </a>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl mb-2">🕒</span>
              <p className="text-lg font-medium">
                Open until {todayHours.close}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Menu Items */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-oak-brown mb-4">
              Featured Menu
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              A taste of what we offer
            </p>
          </div>

          {/* Food Items */}
          <div className="max-w-5xl mx-auto mb-12">
            <h3 className="text-2xl font-bold text-oak-brown mb-6 text-center">Food</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredFood.map((item, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-xl font-bold text-oak-brown">{item.name}</h4>
                    <span className="text-lg font-semibold text-gold ml-4">{item.price}</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Drink Items */}
          <div className="max-w-5xl mx-auto mb-10">
            <h3 className="text-2xl font-bold text-oak-brown mb-6 text-center">Drinks</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredDrinks.map((item, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-bold text-oak-brown">{item.name}</h4>
                    <span className="text-lg font-semibold text-gold ml-2">{item.price}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Link 
              href="/menu" 
              className="inline-block px-8 py-3 bg-oak-brown text-white font-semibold rounded-lg hover:bg-warm-charcoal transition-colors"
            >
              See Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Google Reviews Placeholder */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="flex justify-center items-center gap-2 mb-3">
                <span className="text-4xl text-gold">★★★★★</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-oak-brown mb-2">
                4.6 on Google
              </h2>
              <p className="text-gray-600">Based on customer reviews</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-cream p-6 rounded-lg">
                <div className="text-gold mb-2">★★★★★</div>
                <p className="text-gray-700 italic mb-3">"Great neighborhood spot with excellent food and friendly service. Love the atmosphere!"</p>
                <p className="text-sm text-gray-500">- Google Review</p>
              </div>
              <div className="bg-cream p-6 rounded-lg">
                <div className="text-gold mb-2">★★★★★</div>
                <p className="text-gray-700 italic mb-3">"Best burger in Sellwood! The drinks are fantastic too. Always a good time here."</p>
                <p className="text-sm text-gray-500">- Google Review</p>
              </div>
              <div className="bg-cream p-6 rounded-lg">
                <div className="text-gold mb-2">★★★★★</div>
                <p className="text-gray-700 italic mb-3">"Perfect local pub. Great for watching games, meeting friends, or just grabbing a bite."</p>
                <p className="text-sm text-gray-500">- Google Review</p>
              </div>
            </div>

            <a 
              href="https://www.google.com/maps/search/?api=1&query=The+Oaks+Pub+PDX+1621+SE+Bybee+Blvd+Portland" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-deep-green hover:text-oak-brown font-semibold"
            >
              Read more reviews on Google →
            </a>
          </div>
        </div>
      </section>

      {/* Drinks & Atmosphere Split */}
      <section className="py-16 bg-oak-brown text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-warm-charcoal rounded-lg p-8 lg:p-12 aspect-square flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🍸</div>
                <p className="text-xl text-gold">Craft Cocktails</p>
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Craft Cocktails. Local Beer.<br />No Pretension.
              </h2>
              
              <ul className="space-y-4 mb-8 text-lg">
                {siteConfig.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span className="text-gold mr-3">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Link 
                href="/drinks" 
                className="inline-block px-8 py-3 bg-gold text-oak-brown font-semibold rounded-lg hover:bg-white transition-colors"
              >
                VIEW DRINKS
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Events Preview */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-oak-brown mb-12">
              What's Happening
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-oak-brown mb-2">Trivia Night</h3>
                <p className="text-gray-600">Test your knowledge with friends</p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="text-4xl mb-4">🍻</div>
                <h3 className="text-xl font-bold text-oak-brown mb-2">Happy Hour</h3>
                <p className="text-gray-600">Special pricing on select items</p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="text-4xl mb-4">🏈</div>
                <h3 className="text-xl font-bold text-oak-brown mb-2">Weekend Games</h3>
                <p className="text-gray-600">Watch the big game with us</p>
              </div>
            </div>

            <Link 
              href="/events" 
              className="inline-block px-8 py-3 bg-oak-brown text-white font-semibold rounded-lg hover:bg-warm-charcoal transition-colors"
            >
              See All Events
            </Link>
          </div>
        </div>
      </section>

      {/* Map & Directions */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-oak-brown mb-8 text-center">
              Find Us
            </h2>
            
            <div className="bg-gray-200 rounded-lg mb-8 overflow-hidden flex items-center justify-center" style={{ height: '400px' }}>
              <div className="text-center p-8">
                <div className="text-5xl mb-4">📍</div>
                <p className="text-lg text-gray-700 mb-2">{siteConfig.address.street}</p>
                <p className="text-lg text-gray-700">{siteConfig.address.city}, {siteConfig.address.state} {siteConfig.address.zip}</p>
              </div>
            </div>
            
            <div className="text-center">
              <a 
                href={`https://maps.google.com/?q=${encodeURIComponent(siteConfig.address.street + ', ' + siteConfig.address.city)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 bg-deep-green text-white font-semibold rounded-lg hover:bg-oak-brown transition-colors"
              >
                Get Directions
              </a>
              <p className="mt-4 text-gray-600">
                Street parking available
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
