import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProductsStart, fetchProductsSuccess } from '../store/slices/productsSlice';
import { RootState } from '../store/store';
import ProductCard from '../components/ProductCard';

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    // 模拟获取热门商品
    dispatch(fetchProductsStart());
    setTimeout(() => {
      const mockProducts = [
        {
          id: '1',
          name: '智能手机',
          description: '最新款智能手机，性能强劲',
          price: 2999,
          image: 'https://via.placeholder.com/300x300',
          category: '电子产品',
          stock: 50,
          rating: 4.5,
          reviews: 120
        },
        {
          id: '2',
          name: '笔记本电脑',
          description: '轻薄便携，办公娱乐两不误',
          price: 5999,
          image: 'https://via.placeholder.com/300x300',
          category: '电子产品',
          stock: 30,
          rating: 4.8,
          reviews: 85
        },
        {
          id: '3',
          name: '运动鞋',
          description: '舒适透气，运动首选',
          price: 399,
          image: 'https://via.placeholder.com/300x300',
          category: '服装鞋帽',
          stock: 100,
          rating: 4.3,
          reviews: 200
        },
        {
          id: '4',
          name: '咖啡机',
          description: '专业级咖啡机，在家享受咖啡时光',
          price: 1299,
          image: 'https://via.placeholder.com/300x300',
          category: '家用电器',
          stock: 25,
          rating: 4.6,
          reviews: 65
        }
      ];
      dispatch(fetchProductsSuccess(mockProducts));
    }, 1000);
  }, [dispatch]);

  return (
    <div className="min-h-screen">
      {/* 英雄区域 */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              欢迎来到购物商城
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              发现优质商品，享受便捷购物体验
            </p>
            <Link
              to="/products"
              className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition duration-300"
            >
              立即购物
            </Link>
          </div>
        </div>
      </section>

      {/* 特色商品 */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">热门商品</h2>
            <p className="text-lg text-gray-600">精选优质商品，为您提供最好的选择</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition duration-300"
            >
              查看更多商品
            </Link>
          </div>
        </div>
      </section>

      {/* 优势特色 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">为什么选择我们</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">品质保证</h3>
              <p className="text-gray-600">所有商品均经过严格质检，确保品质可靠</p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">快速配送</h3>
              <p className="text-gray-600">全国范围内快速配送，让您尽快收到心仪商品</p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536m12.728-12.728a9 9 0 11-12.728 12.728 9 9 0 0112.728-12.728z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">售后无忧</h3>
              <p className="text-gray-600">完善的售后服务体系，让您购物无忧</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;