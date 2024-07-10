import { ReactNode } from 'react';
import 'reactflow/dist/style.css';

interface IProps {
  children: ReactNode;
}

const GraphsLayout = ({ children }: IProps) => {
  return <>{children}</>;
};

export default GraphsLayout;
