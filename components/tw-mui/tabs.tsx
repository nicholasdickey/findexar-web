// components/TabsContainer.tsx

import React, { useState, ReactElement } from 'react';
import { TabProps,TabsContainerProps } from './interfaces/tab-interface';


const TabsContainer: React.FC<TabsContainerProps> = ({ children,tabStyle }) => {
  
  const enhancedChildren = React.Children.map(children, (child) =>
    React.isValidElement<TabProps>(child)
      ? React.cloneElement(child, {
          tabStyle,
     
        })
      : child,
  );

  let styles1="";
  let styles2="";
  switch (tabStyle) {
    case "underline":
      styles1="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700";
      break;
    case "icons":
      styles1="border-b border-gray-200 dark:border-gray-700";
      break;
    case "pills":
      styles1="flex flex-wrap text-sm font-medium text-center text-gray-500 dark:text-gray-400";
      break;
    case "vertical":
      styles1="flex-column space-y space-y-4 text-sm font-medium text-gray-500 dark:text-gray-400 md:me-4 mb-4 md:mb-0";    
      break;
    case "fullwidth":
      styles1= "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";
      styles2="hidden text-sm font-medium text-center text-gray-500 rounded-lg shadow sm:flex dark:divide-gray-700 dark:text-gray-400";
      break; 
    default:
      styles1="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400";
   
  }
  if(tabStyle==="fullwidth"){
     return <><div className="sm:hidden">
     <select id="tabs" className={styles1}>
     {enhancedChildren}
     </select></div>
     <ul className={styles2}>{enhancedChildren}</ul>
     </>
  }
  return <ul className={styles1}>{enhancedChildren}</ul>;
};
export default TabsContainer;