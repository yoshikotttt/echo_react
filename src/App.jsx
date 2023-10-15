import {} from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,

  // useParams,
} from "react-router-dom";
import Home from "./pages/Home/Home";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import RequestDoctor from "./pages/RequestDoctor/RequestDoctor";
import ExamDetailInput from "./pages/ExamDetailInput/ExamDetailInput";
import RequestNotificationDetail from "./pages/RequestNotificationDetail/RequestNotificationDetail";
import AcceptedExamDetail from "./pages/AcceptedExamDetail/AcceptedExamDetail";
import NotificationDetail from "./pages/NotificationDetail/NotificationDetail";
import Skyway from "./pages/Skyway/Skyway";
import Layout from "./components/Layout/Layout";
import ProfileEdit from "./pages/ProfileEdit.jsx/ProfileEdit";
import { UserProvider } from "./contexts/UserContext";

// import PrivateRoute from "./components/common/PrivateRoute";

function App() {
  return (
    <>
      <UserProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />}></Route>
              <Route path="/register" element={<Register />}></Route>
              <Route path="/login" element={<Login />}></Route>
              <Route path="/profile-edit" element={<ProfileEdit />}></Route>
              <Route path="/request-doctor" element={<RequestDoctor />}></Route>
              <Route path="/exam-detail-input" element={<ExamDetailInput />} />
              <Route
                path="/request-notification-detail"
                element={<RequestNotificationDetail />}
              ></Route>
              <Route
                path="/accepted-exam-detail/:notificationId"
                element={<AcceptedExamDetail />}
              ></Route>
              <Route
                path="/notification-detail"
                element={<NotificationDetail />}
              ></Route>
              <Route
                path="/skyway/:notificationId"
                element={<Skyway />}
              ></Route>

              {/* デフォルトルート（例: ユーザがサイトにアクセスしたときに表示されるページ） */}
              {/* /login, /register以外のルートに対して以下がマッチする (path="/*" ワイルドカードのため)
          <Route
            path="/*"
            element={
            
                <Routes>
            
                </Routes>
         
            }
          /> */}
            </Routes>
          </Layout>
        </Router>
      </UserProvider>
    </>
  );
}

export default App;
