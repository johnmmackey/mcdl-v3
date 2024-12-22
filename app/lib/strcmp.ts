export default function strcmp(a: String, b: String): number {
    return ((a == b) ? 0 : ((a > b) ? 1 : -1))
}