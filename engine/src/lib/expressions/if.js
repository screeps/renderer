export default (condition, { then = true, else: elseExpr = false }) =>
    (condition ? then : elseExpr);
