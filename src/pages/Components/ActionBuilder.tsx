import React from 'react';
import { Button } from 'antd';

const ActionBuilder = (value: any[] | undefined, handleOk: { (id: any, type: string): void }) => {
  return (value || []).map((action) => {
    const actionValue = action;
    if (actionValue?.component === 'button') {
      if (actionValue?.custom) {
        const customDetails = {
          onClick: () => handleOk(actionValue?.id, actionValue?.custom),
          type: actionValue?.type,
          key: actionValue?.key,
          ghost: true,
          danger: false,
        };

        switch (actionValue?.custom) {
          case 'delete':
            customDetails.danger = true;
            break;
          case 'lock':
            customDetails.danger = true;
            break;
          case 'detailModal':
            // customDetails.danger = true;
            // customDetails.type = 'link';
            break;
          default:
            break;
        }
        return <Button {...customDetails}>{actionValue?.text}</Button>;
      }
    }
  });
};

export default ActionBuilder;
