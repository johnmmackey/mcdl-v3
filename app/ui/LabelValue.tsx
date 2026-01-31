import React from 'react';

export const LabelValue: React.FC<{ label: React.ReactNode; value: React.ReactNode }> = ({ label, value }) => {

    return (
                <>
                    <div className="">
                        <strong>{label}</strong>
                    </div>
                    <div className="">
                        {Array.isArray(value) 
                            ? value.map((v, i) => <span key={i}>{v}{i < (value.length - 1) ? ', ' : ''}</span>)
                            : value
                        }
                    </div>

                </>
    );
}