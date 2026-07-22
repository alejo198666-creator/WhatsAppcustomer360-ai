import {
    useState
} from "react";

import Home from "./pages/Home";

import AdminAccessController from "./admin/components/AdminAccessController.jsx";

import AdminLayout from "./admin/components/AdminLayout.jsx";

import AdminOrdersPage from "./admin/pages/AdminOrdersPage.jsx";

import "./admin/admin.css";

/**
 * Vistas disponibles dentro de la aplicación.
 */
const APP_VIEW = Object.freeze({
    CHAT: "chat",
    ADMIN: "admin",
    ORDERS: "orders"
});

export default function App() {

    const [
        currentView,
        setCurrentView
    ] = useState(APP_VIEW.CHAT);

    const isAdminArea =
        currentView !== APP_VIEW.CHAT;

    function handleAdminAccessGranted() {

        setCurrentView(
            APP_VIEW.ADMIN
        );

    }

    function handleAdminExit() {

        setCurrentView(
            APP_VIEW.CHAT
        );

    }

    function handleOpenOrders() {

        setCurrentView(
            APP_VIEW.ORDERS
        );

    }

    function handleBackToAdmin() {

        setCurrentView(
            APP_VIEW.ADMIN
        );

    }

    return (

        <>

            {
                !isAdminArea && (

                    <AdminAccessController
                        onAccessGranted={
                            handleAdminAccessGranted
                        }
                    />

                )
            }

            {
                currentView === APP_VIEW.CHAT && (

                    <Home/>

                )
            }

            {
                currentView === APP_VIEW.ADMIN && (

                    <AdminLayout
                        onExit={
                            handleAdminExit
                        }
                        onOpenOrders={
                            handleOpenOrders
                        }
                    />

                )
            }

            {
                currentView === APP_VIEW.ORDERS && (

                    <AdminOrdersPage
                        onBack={
                            handleBackToAdmin
                        }
                    />

                )
            }

        </>

    );

}