import Vue from "vue";
import VueRouter from "vue-router";

const Recommend = () =>
  import(/* webpackChunkName: "recommend" */ "components/recommend/recommend");
const Singer = () =>
  import(/* webpackChunkName:'singer' */ "components/singer/singer");
const SingerDetail = () =>
  import(
    /* webpackChunkName:'singer' */ "components/singer-detail/singer-detail"
  );

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/recommend",
  },
  {
    path: "/recommend",
    component: Recommend,
    // children: [
    //   {
    //     path: ":id",
    //     component: Disc,
    //   },
    // ],
  },
  {
    path: "/singer",
    component: Singer,
    children: [
      {
        path: ":id",
        component: SingerDetail,
      },
    ],
  },
  // {
  //   path: "/rank",
  //   component: Rank,
  //   children: [
  //     {
  //       path: ":id",
  //       component: TopList,
  //     },
  //   ],
  // },
  // {
  //   path: "/search",
  //   component: Search,
  //   children: [
  //     {
  //       path: ":id",
  //       component: SingerDetail,
  //     },
  //   ],
  // },
  // {
  //   path: "/user",
  //   component: UserCenter,
  // },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
