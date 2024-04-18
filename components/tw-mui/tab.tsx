// components/Tab.tsx

import React from 'react';
import { TabProps } from './interfaces/tab-interface'

const Tab: React.FC<TabProps> = ({ label, value, active, tabStyle, icon,onClick }) => {
  switch (tabStyle) {
    case "underline":
      return <li className="me-2" onClick={onClick}>
        <a href="#" className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300">Profile</a>
      </li>
    case "icons":
      return <li className="me-2"  onClick={onClick}>
        <a href="#" className="inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group">
          {icon} {label}
        </a>
      </li>
    default:
      return <li className="me-2"  onClick={onClick}>
        <a href="#" aria-current="page" className="inline-block p-4 text-blue-600 bg-gray-100 rounded-t-lg active dark:bg-gray-800 dark:text-blue-500">Profile</a>
      </li>
  }

};

export default Tab;