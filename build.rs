fn main() {
    println!("cargo:rerun-if-changed=crates/blend-db/migrations");
}
