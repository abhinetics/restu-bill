import { useState, useEffect } from 'react';

// Separate MenuCard component
const MenuCard = ({ item, currentOrder = [], toggleOrder, updateQuantity }) => {
  const isSelected = currentOrder?.some(i => i.id === item.id);
  const selectedItem = currentOrder?.find(i => i.id === item.id);
  
  return (
    <div
      onClick={() => toggleOrder(item)}
      className={`group cursor-pointer rounded-2xl transition-all duration-300 transform active:scale-95 touch-target ${
        isSelected 
          ? 'bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-400 shadow-lg' 
          : 'bg-white border border-gray-200 hover:border-green-300 hover:shadow-lg active:shadow-xl'
      }`}
    >
      <div className="p-4 sm:p-5 flex flex-col items-center relative">
        {isSelected && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
        
        <span className="text-3xl sm:text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-200">
          {item.image}
        </span>
        
        <h3 className="font-semibold text-center mb-2 text-sm sm:text-base text-gray-800 leading-tight">
          {item.name}
        </h3>
        
        <div className="flex items-center justify-between w-full">
          <p className="font-mono font-bold text-green-600 text-lg">
            ₹{item.price}
          </p>
          
          {isSelected && selectedItem && (
            <div className="px-2 py-1 bg-green-500 text-white text-xs rounded-full font-medium">
              {selectedItem.quantity}x
            </div>
          )}
        </div>
        
        <div className="mt-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
          {item.category}
        </div>
      </div>
      
      <div className={`h-1 rounded-b-2xl transition-all duration-300 ${
        isSelected 
          ? 'bg-gradient-to-r from-green-400 to-green-600' 
          : 'bg-transparent group-hover:bg-gradient-to-r group-hover:from-green-200 group-hover:to-green-300'
      }`} />
    </div>
  );
};

// App component
function App() {
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState([]);
  const [orderCount, setOrderCount] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activePanel, setActivePanel] = useState(null);

  // Load orders from memory on component mount
  useEffect(() => {
    const savedOrders = [];
    setOrders(savedOrders);
    if (savedOrders.length > 0) {
      setOrderCount(savedOrders.length + 1);
    }
  }, []);

  const foodItems = [
    { id: 1, name: 'Spring Rolls', price: 500, category: 'Starters', image: '🥢' },
    { id: 2, name: 'Chicken Wings', price: 700, category: 'Starters', image: '🍗' },
    { id: 3, name: 'Garlic Bread', price: 400, category: 'Starters', image: '🥖' },
    { id: 4, name: 'Mozzarella Sticks', price: 600, category: 'Starters', image: '🧀' },
    { id: 5, name: 'Pizza Margherita', price: 1000, category: 'Main Course', image: '🍕' },
    { id: 6, name: 'Burger Deluxe', price: 1200, category: 'Main Course', image: '🍔' },
    { id: 7, name: 'Pasta Alfredo', price: 900, category: 'Main Course', image: '🍝' },
    { id: 8, name: 'Grilled Chicken', price: 1000, category: 'Main Course', image: '🍗' },
    { id: 9, name: 'Fish & Chips', price: 1100, category: 'Main Course', image: '🐟' },
    { id: 10, name: 'Ice Cream', price: 400, category: 'Desserts', image: '🍦' },
    { id: 11, name: 'Chocolate Cake', price: 500, category: 'Desserts', image: '🍰' },
    { id: 12, name: 'Tiramisu', price: 600, category: 'Desserts', image: '🧁' },
    { id: 13, name: 'Cola', price: 200, category: 'Beverages', image: '🥤' },
    { id: 14, name: 'Fresh Juice', price: 400, category: 'Beverages', image: '🧃' },
    { id: 15, name: 'Coffee', price: 300, category: 'Beverages', image: '☕' },
  ];

  const categories = [...new Set(foodItems.map(item => item.category))];
  const filteredItems = searchQuery
    ? foodItems.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : foodItems;

  const togglePanel = (panel) => setActivePanel(activePanel === panel ? null : panel);
  
  const toggleOrder = (item) => {
    setCurrentOrder(current => {
      const existingItem = current.find(i => i.id === item.id);
      if (existingItem) {
        return current.filter(i => i.id !== item.id);
      } else {
        return [...current, { ...item, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (itemId, change) => {
    setCurrentOrder(current => 
      current.map(item => {
        if (item.id === itemId) {
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const saveOrder = () => {
    if (currentOrder.length > 0) {
      const newOrder = { 
        id: orderCount, 
        items: currentOrder,
        date: new Date().toISOString(),
        total: currentOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };
      const updatedOrders = [...orders, newOrder];
      setOrders(updatedOrders);
      setOrderCount(prev => prev + 1);
      setCurrentOrder([]);
      setActivePanel(null);
    }
  };

  const deleteOrder = (orderId) => {
    const updatedOrders = orders.filter(order => order.id !== orderId);
    setOrders(updatedOrders);
  };

  // Analytics calculations
  const getAnalytics = () => {
    if (orders.length === 0) return null;

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalRevenue / totalOrders;

    // Most popular items
    const itemCounts = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
      });
    });

    const popularItems = Object.entries(itemCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    // Category wise sales
    const categorySales = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        categorySales[item.category] = (categorySales[item.category] || 0) + (item.price * item.quantity);
      });
    });

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      popularItems,
      categorySales
    };
  };

  const analytics = getAnalytics();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800">
      {/* Header */}
      {/* Enhanced header with better mobile spacing */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-lg shadow-sm z-40 px-3 py-2 sm:px-4 sm:py-3">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent text-center px-4">
            <span className="block sm:inline">IPO</span>
            <span className="block text-sm sm:text-xl md:text-2xl sm:inline sm:ml-2">Instant Platter Offering</span>
          </h1>
          <div className="flex gap-2 sm:gap-3">
            {/* Enhanced button styling with better touch targets */}
            <button
              onClick={() => togglePanel('analytics')}
              className="relative p-3 rounded-xl bg-purple-50 hover:bg-purple-100 active:bg-purple-200 transition-all duration-200 touch-target focus-ring"
              title="Analytics"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {/* Enhanced notification badge */}
              {analytics && (
                <span className="absolute -top-1 -right-1 bg-purple-500 text-white w-2 h-2 rounded-full animate-pulse" />
              )}
            </button>
            
            <button
              onClick={() => togglePanel('saved')}
              className="relative p-3 rounded-xl bg-blue-50 hover:bg-blue-100 active:bg-blue-200 transition-all duration-200 touch-target focus-ring"
              title="Order History"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {orders.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center font-medium">
                  {orders.length > 99 ? '99+' : orders.length}
                </span>
              )}
            </button>
            
            <button
              onClick={() => togglePanel('current')}
              className="relative p-3 rounded-xl bg-green-50 hover:bg-green-100 active:bg-green-200 transition-all duration-200 touch-target focus-ring"
              title="Current Order"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {currentOrder.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-600 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center font-medium animate-bounce">
                  {currentOrder.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

     
      <div className="sticky top-14 sm:top-16 pt-3 pb-2 px-3 sm:px-4 bg-gradient-to-b from-gray-50 via-gray-50/90 to-transparent z-30">
        <div className="max-w-lg mx-auto relative">
          <input
            type="text"
            placeholder="Search dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-none bg-white shadow-lg focus:ring-2 focus:ring-green-500 focus:shadow-xl outline-none transition-all duration-300 text-base"
          />
          <svg
            className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>


      <main className="pt-28 sm:pt-32 pb-20 px-3 sm:px-4">
        <div className="max-w-6xl mx-auto">
          {searchQuery ? (
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {filteredItems.map(item => (
                <MenuCard 
                  key={item.id} 
                  item={item} 
                  currentOrder={currentOrder}
                  toggleOrder={toggleOrder}
                  updateQuantity={updateQuantity}
                />
              ))}
            </div>
          ) : (
            categories.map(category => (
              <div key={category} className="mb-8 sm:mb-12">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 pl-3 border-l-4 border-green-500 mobile-heading">
                  {category}
                </h2>
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {foodItems
                    .filter(item => item.category === category)
                    .map(item => (
                      <MenuCard 
                        key={item.id} 
                        item={item}
                        currentOrder={currentOrder}
                        toggleOrder={toggleOrder}
                        updateQuantity={updateQuantity}
                      />
                    ))}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Side Panels */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 z-40 ${activePanel ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setActivePanel(null)}
      />
      
      <div
        className={`fixed top-0 right-0 w-full sm:w-[420px] md:w-[450px] h-screen bg-white shadow-2xl transform transition-transform duration-500 ease-out z-50 flex flex-col ${
          activePanel ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Panel header */}
        <div className="flex-none p-4 sm:p-6 border-b bg-gradient-to-r from-gray-50 to-white">
          <div className="flex justify-between items-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              {activePanel === 'current' && 'Current Order'}
              {activePanel === 'saved' && 'Order History'}
              {activePanel === 'analytics' && 'Analytics'}
            </h2>
            <button 
              onClick={() => setActivePanel(null)} 
              className="p-2 hover:bg-gray-100 active:bg-gray-200 rounded-xl transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="p-4 sm:p-6 space-y-4">
            {/* Current Order Panel */}
            {activePanel === 'current' && (
              <div className="space-y-4">
                {currentOrder.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Your order is empty</p>
                ) : (
                  <>
                    {currentOrder.map(item => (
                      <div key={item.id} className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{item.image}</span>
                          <div>
                            <h3 className="font-medium text-gray-800">{item.name}</h3>
                            <span>₹{item.price * item.quantity}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, -1); }}
                            className="p-1 hover:bg-gray-100 rounded-lg"
                          >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="font-medium w-8 text-center">{item.quantity}</span>
                          <button 
                            onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, 1); }}
                            className="p-1 hover:bg-gray-100 rounded-lg"
                          >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="mt-6 border-t pt-4">
                      <div className="flex justify-between items-center text-lg font-bold mb-6">
                        <span>Total:</span>
                        <span>₹{currentOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0)}</span>
                      </div>
                      <button
                        onClick={saveOrder}
                        className="w-full py-3 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white rounded-xl font-medium transition-colors"
                      >
                        Complete Order
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Order History Panel */}
            {activePanel === 'saved' && (
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No saved orders</p>
                ) : (
                  orders.map(order => (
                    <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                      <div className="p-4 border-b">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium text-gray-800">Order #{order.id}</h3>
                          <button
                            onClick={() => deleteOrder(order.id)}
                            className="text-red-500 hover:text-red-600 p-1 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        <p className="text-sm text-gray-500">{new Date(order.date).toLocaleString()}</p>
                      </div>
                      <div className="p-4">
                        {order.items.map(item => (
                          <div key={item.id} className="flex justify-between items-center py-2">
                            <div className="flex items-center space-x-3">
                              <span className="text-xl">{item.image}</span>
                              <span className="text-gray-800">{item.name}</span>
                            </div>
                            <div className="text-gray-600">
                              {item.quantity}x ₹{item.price}
                            </div>
                          </div>
                        ))}
                        <div className="mt-4 pt-4 border-t flex justify-between items-center font-bold">
                          <span>Total:</span>
                          <span>${order.total}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Analytics Panel */}
            {activePanel === 'analytics' && analytics && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h3 className="text-gray-500 text-sm mb-2">Total Revenue</h3>
                    <p className="text-2xl font-bold text-gray-800">₹{analytics.totalRevenue}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h3 className="text-gray-500 text-sm mb-2">Total Orders</h3>
                    <p className="text-2xl font-bold text-gray-800">{analytics.totalOrders}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h3 className="text-gray-500 text-sm mb-2">Average Order Value</h3>
                    <p className="text-2xl font-bold text-gray-800">₹{analytics.averageOrderValue}</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <h3 className="font-medium text-gray-800 mb-4">Popular Items</h3>
                  <div className="space-y-3">
                    {analytics.popularItems.map(([name, count]) => (
                      <div key={name} className="flex justify-between items-center">
                        <span className="text-gray-600">{name}</span>
                        <span className="font-medium">{count} sold</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <h3 className="font-medium text-gray-800 mb-4">Sales by Category</h3>
                  <div className="space-y-3">
                    {Object.entries(analytics.categorySales).map(([category, sales]) => (
                      <div key={category} className="flex justify-between items-center">
                        <span className="text-gray-600">{category}</span>
                        <span className="font-medium">₹{sales}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  </div>
  );
}

export default App;