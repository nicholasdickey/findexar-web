// interfaces/TabInterface.ts

export interface TabProps {
    label: string;
    value: string; 
    active?: boolean;
    tabStyle: string;
    icon?: React.ReactNode;
    onClick: any;
  }

  export interface TabsContainerProps {
    children: React.ReactElement<TabProps>[] | React.ReactElement<TabProps>;
    tabStyle: string; // The default active tab index
  }