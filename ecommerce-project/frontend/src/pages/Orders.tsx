import React from 'react';

const Orders: React.FC = () => {
  const mockOrders = [
    {
      id: 'ORD001',
      date: '2024-01-15',
      status: '已发货',
      total: 2999,
      items: [
        { name: '智能手机', quantity: 1, price: 2999 }
      ]
    },
    {
      id: 'ORD002',
      date: '2024-01-10',
      status: '已完成',
      total: 1698,
      items: [
        { name: '运动鞋', quantity: 2, price: 399 },
        { name: '咖啡机', quantity: 1, price: 899 }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case '已完成':
        return 'bg-green-100 text-green-800';
      case '已发货':
        return 'bg-blue-100 text-blue-800';
      case '待付款':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">我的订单</h1>

      <div className="space-y-6">
        {mockOrders.map((order) => (
          <div key={order.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    订单号: {order.id}
                  </h3>
                  <p className="text-sm text-gray-600">下单时间: {order.date}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <span className="text-lg font-semibold text-primary-600">
                    ¥{order.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="px-6 py-4">
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="font-medium">{item.name}</span>
                      <span className="ml-2 text-gray-500">x{item.quantity}</span>
                    </div>
                    <span className="text-gray-900">¥{item.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <button className="text-primary-600 hover:text-primary-700 font-medium">
                  查看详情
                </button>
                {order.status === '待付款' && (
                  <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">
                    立即付款
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {mockOrders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">您还没有任何订单</p>
        </div>
      )}
    </div>
  );
};

export default Orders;