import type { ReactNode } from 'react'

import InfoBar from '@/components/infobar'
import Sidebar from "@/components/sidebar";

type Props = { children: ReactNode }

const Layout = (props: Props) => {
    return (
        <div className="flex overflow-hidden h-screen">
            <Sidebar />
            <div className="w-full">
                <InfoBar />
                {props.children}
            </div>
        </div>
    )
}

export default Layout
