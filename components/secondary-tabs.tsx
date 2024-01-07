import React from "react";
import { styled } from "styled-components";
import { Tabs, Tab } from '@mui/material'

const TabsWrap = styled.div`
background-color: #811717;
font-size:10px;
color:#fff !important;
`;
const AntTabs = styled(Tabs)({
    borderBottom: '1px solid #e8e8e8',
    '& .MuiTabs-indicator': {
      backgroundColor: '#1890ff',
    },
  });
  
  const AntTab = styled((props: StyledTabProps) => <Tab disableRipple {...props} />)(
    ({ theme }) => ({
      textTransform: 'none',
      minWidth: 0,
      [theme.breakpoints.up('sm')]: {
        minWidth: 0,
      },
      fontWeight: theme.typography.fontWeightRegular,
      marginRight: theme.spacing(1),
      color: '#fff',
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      '&:hover': {
        color: '#40a9ff',
        opacity: 1,
      },
      '&.Mui-selected': {
        color: '#1890ff',
        fontWeight: theme.typography.fontWeightMedium,
      },
      '&.Mui-focusVisible': {
        backgroundColor: '#d1eaff',
      },
    }),
  );
  interface StyledTabsProps {
    children?: React.ReactNode;
    value: number;   
    onChange: (event: React.SyntheticEvent, newValue: number) => void;
  }
  
  const StyledTabs = styled((props: StyledTabsProps) => (
    <Tabs
      {...props}
      TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
    />
  ))({
    '& .MuiTabs-indicator': {
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },
    '& .MuiTabs-indicatorSpan': {
      maxWidth: 40,
      width: '100%',
      backgroundColor: '#635ee7',
    },
  });
  
  interface StyledTabProps {
    label: string;
    icon:any;

  }
  interface STabsProps {
    selected: boolean;
  }
  const STab = styled(Tab)<STabsProps>`
    color:${({selected})=>`rgba(255, 255, 255, ${selected?0.8:0.6})`} !important;
    font-size: 10px;
 `;

  const STabs = styled(Tabs)`
   background: #e31f1f !important;
  
  `;
interface Option {
    name: string;
    icon: any;
    access?: string;
}
interface Props {
    options: Option[];
    onChange: (option: Option) => void;
    selectedOptionName?: string;
}

const SecondaryTabs: React.FC<Props> = ({ options, onChange,selectedOptionName }: Props) => {
    let selectedValue=0;
    const IconTabs = options.map((option: Option, i: number) => {
      let selected=false;
        if(option.name.toLowerCase()==selectedOptionName?.toLowerCase()){
          selected=true;  
          selectedValue=i;
        }
        return <STab selected={selected} key={`tab-${i}`} label={option.name} icon={option.icon} />;
    });
    return <TabsWrap><STabs  textColor="primary" variant="fullWidth" value={selectedValue} onChange={(event, value) =>{console.log("onChange",value); onChange(options[value])}}>{IconTabs}</STabs></TabsWrap>;
};

export default SecondaryTabs;