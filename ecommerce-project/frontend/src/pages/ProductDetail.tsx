import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductStart, fetchProductSuccess } from '../store/slices/productsSlice';
import { addToCart } from '../store/slices/cartSlice';
import { RootState } from '../store/store';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { currentProduct, loading } = useSelector((state: RootState) => state.products);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductStart());
      // 模拟 API 调用
      setTimeout(() => {
        const mockProduct = {
          id: id,
          name: '智能手机',
          description: '这是一款功能强大的智能手机，配备最新的处理器和高清摄像头，为您提供卓越的移动体验。支持5G网络，超长续航，让您的生活更加便捷。',
          price: 2999,
          image: 'https://via.placeholder.com/500x500',
          category: '电子产品',
          stock: 50,
          rating: 4.5,
          reviews: 120
        };
        dispatch(fetchProductSuccess(mockProduct));
      }, 500);
    }
  }, [id, dispatch]);

  const handleAddToCart = () => {
    if (currentProduct) {
      for (let i = 0; i < quantity; i++) {
        dispatch(addToCart({
          id: currentProduct.id,
          name: currentProduct.name,
          price: currentProduct.price,
          image: currentProduct.image,
          maxQuantity: currentProduct.stock
        }));
      }
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`w-5 h-5 ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">商品未找到</p>
          <Link
            to="/products"
            className="mt-4 inline-block text-primary-600 hover:text-primary-700"
          >
            返回商品列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          to="/products"
          className="text-primary-600 hover:text-primary-700"
        >
          ← 返回商品列表
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 商品图片 */}
        <div>
          <img
            src={currentProduct.image}
            alt={currentProduct.name}
            className="w-full h-96 object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* 商品信息 */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {currentProduct.name}
          </h1>

          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {renderStars(currentProduct.rating)}
            </div>
            <span className="ml-2 text-gray-600">({currentProduct.reviews} 评价)</span>
          </div>

          <div className="mb-6">
            <span className="text-3xl font-bold text-primary-600">
              ¥{currentProduct.price.toLocaleString()}
            </span>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">商品描述</h3>
            <p className="text-gray-700 leading-relaxed">
              {currentProduct.description}
            </p>
          </div>

          <div className="mb-6">
            <span className="text-gray-600">分类: </span>
            <span className="font-medium">{currentProduct.category}</span>
          </div>

          <div className="mb-6">
            <span className="text-gray-600">库存: </span>
            <span className={`font-medium ${currentProduct.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {currentProduct.stock > 0 ? `${currentProduct.stock} 件` : '缺货'}
            </span>
          </div>

          {currentProduct.stock > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                数量
              </label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
                >
                  -
                </button>
                <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(currentProduct.stock, quantity + 1))}
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
                >
                  +
                </button>
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <button
              onClick={handleAddToCart}
              disabled={currentProduct.stock === 0}
              className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-md font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentProduct.stock > 0 ? '加入购物车' : '暂时缺货'}
            </button>
            <button
              disabled={currentProduct.stock === 0}
              className="flex-1 bg-secondary-600 text-white py-3 px-6 rounded-md font-medium hover:bg-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              立即购买
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;