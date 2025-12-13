import { ReactNode } from 'react';
import { Button, Divider } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

interface StepItemContentProps {
    children?: ReactNode;
    color?: string;
    headerLeft?: ReactNode;
    headerRight?: ReactNode;
    showHeader?: boolean;
    showFooter?: boolean;
    footerContent?: ReactNode;
    ResumeIcon?: any;
    ResumeSearchIcon?: any;
    resumeContent?: ReactNode;
    resumeButtons?: ReactNode;
    onClickSearch?: () => void;
    showSearchButton?: boolean;
    bgcolor?: string;
}

export const StepItemContentAntd = ({
    children,
    headerLeft,
    headerRight,
    showHeader,
    showFooter,
    footerContent,
    ResumeIcon = SearchOutlined,
    ResumeSearchIcon = SearchOutlined,
    color = '#04BA6B',
    bgcolor = 'white',
    resumeContent,
    resumeButtons,
    onClickSearch,
    showSearchButton = true,
}: StepItemContentProps) => {
    return (
        <div style={{ backgroundColor: bgcolor, borderRadius: '8px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            {showHeader && (
                <>
                    {/* Top Header Strip */}
                    <div style={{
                        backgroundColor: color,
                        color: 'white',
                        padding: '4px 16px',
                        borderTopLeftRadius: '8px',
                        borderTopRightRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '12px',
                        height: '32px'
                    }}>
                        <div>{headerLeft}</div>
                        <div>{headerRight}</div>
                    </div>

                    {/* Main Resume Section */}
                    <div style={{
                        backgroundColor: '#2f3a4b',
                        color: 'white',
                        padding: '16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottomLeftRadius: children ? 0 : '8px',
                        borderBottomRightRadius: children ? 0 : '8px',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {ResumeIcon && <ResumeIcon style={{ fontSize: '56px', color: color }} />}
                            </div>
                            {/* AntD Divider vertical needs height specified usually via style or class if not flex parent handling it well */}
                            <div style={{ height: '40px', borderLeft: `2px solid ${color}` }}></div>
                            <div>{resumeContent}</div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {showSearchButton && (
                                <Button
                                    icon={<ResumeSearchIcon style={{ fontSize: '20px' }} />}
                                    type="default"
                                    ghost
                                    style={{
                                        borderColor: color,
                                        color: color,
                                        width: '44px',
                                        height: '44px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: 0
                                    }}
                                    onClick={onClickSearch}
                                />
                            )}
                            {resumeButtons}
                        </div>
                    </div>
                </>
            )}

            {showFooter && footerContent && (
                <div style={{
                    backgroundColor: '#00101e',
                    color: 'white',
                    padding: '12px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    {footerContent}
                </div>
            )}

            {children && (
                <div style={{
                    padding: '32px',
                    backgroundColor: 'white',
                    borderBottomLeftRadius: showFooter ? 0 : '8px',
                    borderBottomRightRadius: showFooter ? 0 : '8px',
                }}>
                    {children}
                </div>
            )}
        </div>
    );
};
