import argparse
import subprocess
import sys


def run(command: list[str]) -> None:
    completed = subprocess.run(command, check=True)
    if completed.returncode != 0:
        raise RuntimeError(f"Command failed: {' '.join(command)}")


def main() -> None:
    parser = argparse.ArgumentParser(description="End-to-end retraining pipeline.")
    parser.add_argument("--city", default="lahore", choices=["lahore", "karachi"])
    parser.add_argument("--pages", type=int, default=3)
    parser.add_argument("--dataset", default="artifacts/cleaned_properties.csv")
    args = parser.parse_args()

    run([sys.executable, "scripts/scrape_zameen.py", "--city", args.city, "--pages", str(args.pages)])
    run([sys.executable, "scripts/clean_dataset.py", "--output", args.dataset])
    run([sys.executable, "scripts/train_model.py", "--dataset", args.dataset])
    print("Retraining pipeline completed successfully.")


if __name__ == "__main__":
    main()

