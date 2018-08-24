/**
 * Created by vedi on 13/09/2017.
 */

export default ({ state, world: { options: { BADGE_URL } } }) => {
    const { users } = state;
    if (users) {
        Object.entries(users).forEach(([, user]) => {
            const { username } = user;
            user.badgeUrl = BADGE_URL.replace('%1', encodeURIComponent(username));
        });
    }
};
