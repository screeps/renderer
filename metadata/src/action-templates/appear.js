/**
 * Created by vedi on 19/03/2017.
 */

export default (duration = { $processorParam: 'tickDuration' }) => ({
    action: 'FadeIn',
    params: [duration],
});
