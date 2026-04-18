import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">购物商城</h3>
            <p className="text-gray-300 mb-4">
              专业的电商平台，为您提供优质的商品和服务。
              我们致力于让每一次购物都成为愉快的体验。
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <span className="sr-only">微信</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.58,14.99c-0.26,0-0.48-0.22-0.48-0.48c0-0.27,0.22-0.48,0.48-0.48c0.27,0,0.48,0.22,0.48,0.48C9.06,14.77,8.85,14.99,8.58,14.99z M12.43,14.99c-0.26,0-0.48-0.22-0.48-0.48c0-0.27,0.22-0.48,0.48-0.48c0.27,0,0.48,0.22,0.48,0.48C12.91,14.77,12.7,14.99,12.43,14.99z M10.5,9.19c-0.26,0-0.48-0.22-0.48-0.48c0-0.27,0.22-0.48,0.48-0.48c0.27,0,0.48,0.22,0.48,0.48C10.98,8.97,10.77,9.19,10.5,9.19z M14.35,9.19c-0.26,0-0.48-0.22-0.48-0.48c0-0.27,0.22-0.48,0.48-0.48c0.27,0,0.48,0.22,0.48,0.48C14.83,8.97,14.62,9.19,14.35,9.19z M17.5,12.58c0-2.7-2.79-4.88-6.22-4.88s-6.22,2.18-6.22,4.88c0,2.7,2.79,4.88,6.22,4.88c0.75,0,1.47-0.1,2.15-0.28l1.94,1.13c0.08,0.05,0.17,0.07,0.26,0.07c0.14,0,0.28-0.06,0.38-0.17c0.19-0.21,0.18-0.54-0.03-0.73l-1.68-1.55C15.83,15.2,17.5,14.01,17.5,12.58z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <span className="sr-only">微博</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10.75,15.75c-3.03,0-5.5-1.36-5.5-3.03c0-0.94,0.63-1.98,1.68-2.56c1.41-0.78,3.2-0.53,4.77,0.44c1.04,0.65,1.72,1.53,1.87,2.35c0.19,1.06-0.53,1.74-1.75,1.74c-0.44,0-0.8-0.13-0.99-0.26c-0.17-0.11-0.28-0.16-0.36-0.16c-0.21,0-0.34,0.21-0.34,0.47c0,0.34,0.26,0.62,0.59,0.62c0.11,0,0.22-0.03,0.33-0.09c0.28-0.16,0.61-0.25,0.95-0.25c0.94,0,1.72,0.63,1.72,1.41c0,0.78-0.78,1.41-1.72,1.41c-0.34,0-0.67-0.09-0.95-0.25c-0.11-0.06-0.22-0.09-0.33-0.09c-0.33,0-0.59,0.28-0.59,0.62c0,0.26,0.13,0.47,0.34,0.47c0.08,0,0.19-0.05,0.36-0.16c0.19-0.13,0.55-0.26,0.99-0.26c1.22,0,1.94,0.68,1.75,1.74c-0.15,0.82-0.83,1.7-1.87,2.35c-1.57,0.97-3.36,1.22-4.77,0.44c-1.05-0.58-1.68-1.62-1.68-2.56c0-1.67,2.47-3.03,5.5-3.03c0.55,0,1,0.07,1.39,0.18c0.19,0.05,0.39,0.08,0.61,0.08c0.94,0,1.72,0.78,1.72,1.72c0,0.94-0.78,1.72-1.72,1.72c-0.22,0-0.42-0.03-0.61-0.08c-0.39-0.11-0.84-0.18-1.39-0.18z"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">客户服务</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">帮助中心</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">联系我们</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">退换货政策</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">配送说明</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">关于我们</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">公司简介</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">招聘信息</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">隐私政策</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">服务条款</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-center text-gray-300">
            &copy; 2024 购物商城. 保留所有权利.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;