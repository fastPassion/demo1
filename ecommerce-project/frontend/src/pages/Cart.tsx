import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../store/store';
import { removeFromCart, updateQuantity, clearCart, CartItem } from '../store/slices/cartSlice';

const Cart: React.FC = () => {
  const dispatch = useDispatch();
  const { items, totalItems, totalPrice } = useSelector((state: RootState) => state.cart);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      dispatch(removeFromCart(id));
    } else {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const handleClearCart = () => {
    if (window.confirm('确定要清空购物车吗？')) {
      dispatch(clearCart());
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h2 className="mt-4 text-lg font-medium text-gray-900">购物车是空的</h2>
          <p className="mt-2 text-gray-500">看起来您还没有添加任何商品到购物车</p>
          <div className="mt-6">
            <Link
              to="/products"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              去购物
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">购物车</h1>
        <button
          onClick={handleClearCart}
          className="text-red-600 hover:text-red-700 font-medium"
        >
          清空购物车
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 购物车商品列表 */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                商品 ({totalItems} 件)
              </h2>
            </div>

            <div className="divide-y divide-gray-200">
              {items.map((item: CartItem) => (
                <div key={item.id} className="p-6">
                  <div className="flex items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />

                    <div className="ml-4 flex-1">
                      <Link
                        to={`/products/${item.id}`}
                        className="text-lg font-medium text-gray-900 hover:text-primary-600"
                      >
                        {item.name}
                      </Link>

                      <div className="mt-1 text-sm text-gray-500">
                        单价: ¥{item.price.toLocaleString()}
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
                          >
                            -
                          </button>
                          <span className="text-lg font-medium">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.maxQuantity}
                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            +
                          </button>
                        </div>

                        <div className="flex items-center space-x-4">
                          <span className="text-lg font-semibold text-primary-600">
                            ¥{(item.price * item.quantity).toLocaleString()}
                          </span>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 订单摘要 */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow-md rounded-lg p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">订单摘要</h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">商品数量</span>
                <span className="font-medium">{totalItems} 件</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">小计</span>
                <span className="font-medium">¥{totalPrice.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">运费</span>
                <span className="font-medium">免费</span>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold">总计</span>
                  <span className="text-lg font-semibold text-primary-600">
                    ¥{totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <button className="w-full mt-6 bg-primary-600 text-white py-3 px-4 rounded-md font-medium hover:bg-primary-700 transition duration-300">
              去结算
            </button>

            <div className="mt-4 text-center">
              <Link
                to="/products"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                继续购物
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;