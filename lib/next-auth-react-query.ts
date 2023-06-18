// import { useQuery } from "@tanstack/react-query";
// import { Session } from "next-auth";
// import { useRouter } from "next/navigation";

//  export default function useSession<R extends boolean = false>({
//   required,
//   redirectTo = '/api/auth/signin?error=SessionExpired',
//   queryConfig,
// }: {
//   /** If set to `true`, the returned session is guaranteed to not be `null` */
//   required?: R;
//   /** If `required: true`, the user will be redirected to this URL, if they don't have a session */
//   redirectTo?: string;
//   queryConfig?: QueryConfig<Session | null>;
// } = {}) {
//   const router = useRouter();
//   const query = useQuery(['session'], fetchSession, {
//     onSettled(data) {
//       if (data || !required) return;
//       router.push(redirectTo);
//     },
//     ...queryConfig,
//   });

//   return {
//     data: query.data as R extends true ? Session : Session | null,
//     status:
//       query.status === 'loading'
//         ? 'loading'
//         : query.data
//         ? 'authenticated'
//         : 'unauthenticated',
//     query,
//   } as const;
// }
