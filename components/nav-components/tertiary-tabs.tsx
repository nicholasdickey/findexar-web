import React from "react";
import { styled } from "styled-components";
import { Tabs, Tab } from '@mui/material'

const TabsWrap = styled.div`
//background-color: #fff;
font-size:12px;
color:#444 !important;
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
  
 
  interface StyledTabProps {
    label: string;
    icon:any;

  }
  interface STabsProps {
    selected: boolean;
  }
  const STab = styled(Tab)<STabsProps>`
    color:${({selected})=>`var(--${selected?'selected':'text'})`} !important;
    background-color: ${({selected})=>`var(--${selected?'background':'background'})`} !important;
    font-size: 12px !important;
    height:10px !important;
    border: 0px solid ${({selected})=>selected?`var(--background)`:`var(--background)` }!important;
 `;

  const STabs = styled(Tabs)`
   //background: #706e85 !important;

  //height:28px;
  `;
interface Option {
    name: string;
    tab:string;
}
interface Props {
    options: Option[];
    onChange: (option: Option) => void;
    selectedOptionName?: string;
}

const TertiaryTabs: React.FC<Props> = ({ options, onChange,selectedOptionName }: Props) => {
    let selectedValue=0;
    const tabs = options.map((option: Option, i: number) => {
      let selected=false;
        if(option.tab.toLowerCase()==selectedOptionName?.toLowerCase()){
          selected=true;  
          selectedValue=i;
        }
        return <STab selected={selected} key={`tab-${i}`} label={option.name} />;
    });
    return <TabsWrap>< Tabs textColor="primary" variant="fullWidth" value={selectedValue} onChange={(event, value) =>{console.log("onChange",value); onChange(options[value])}}>{tabs}</Tabs></TabsWrap>;
};

export default TertiaryTabs;