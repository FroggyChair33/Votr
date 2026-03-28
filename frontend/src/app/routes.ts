import { createBrowserRouter } from "react-router";
import { MainLayout } from "./components/MainLayout";
import { HowToVoteGuidePage } from "./components/pages/HowToVoteGuidePage";
import { CampusResourcesPage } from "./components/pages/CampusResourcesPage";
import { UpcomingElectionsPage } from "./components/pages/UpcomingElectionsPage";
import { CandidateInformationPage } from "./components/pages/CandidateInformationPage";
import { HomePage } from "./components/pages/HomePage";
import { LeaderboardPage } from "./components/pages/LeaderboardPage";
import { VerifyPage } from "./components/pages/VerifyPage";
import { ResourcesPage } from "./components/pages/ResourcesPage";
import { ProfilePage } from "./components/pages/ProfilePage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: "leaderboard",
        Component: LeaderboardPage,
      },
      {
        path: "verify",
        Component: VerifyPage,
      },
      {
        path: "resources",
        Component: ResourcesPage,
      },
      {
        path: "profile",
        Component: ProfilePage,
      },
      {
        path: "vote-guide",
        Component: HowToVoteGuidePage,
      },
      {
        path: "campus-resources",
        Component: CampusResourcesPage,
      },
      {
        path: "upcoming-elections",
        Component: UpcomingElectionsPage,
      },
      {
        path: "candidate-information",
        Component: CandidateInformationPage,
      },
    ],
  },
]);