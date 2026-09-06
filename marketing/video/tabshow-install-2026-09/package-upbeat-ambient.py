#!/usr/bin/env python3
"""Package the separate upbeat ambient edition without changing original assets."""

import hashlib
import json
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile


HERE = Path(__file__).resolve().parent
OUTPUT = HERE / "output"
TITLE = "TabShow for Chrome — Live Tab Preview in 48 Seconds"
VIDEO = "TabShow-Chrome-Web-Store-1080p60-Upbeat-Ambient.mp4"
TITLE_FILE = "YouTube-Title-Upbeat-Ambient.txt"
METADATA_FILE = "YouTube-Metadata-Upbeat-Ambient.json"
TRANSCRIPT_FILE = "TabShow-Transcript-Upbeat-Ambient.txt"
PUBLICATION_FILE = "publication-upbeat-ambient.json"
ARCHIVE = HERE / "TabShow-YouTube-Upload-Package-Upbeat-Ambient.zip"

# Only reusable content and upload settings are taken from the original package.
# Its video ID, publication date, checks and public verification are never copied.
REUSABLE_FIELDS = (
    "description", "tags", "defaultLanguage", "categoryId", "madeForKids",
    "embeddable", "license", "suggestedVisibility", "durationSeconds",
    "chapters", "captions", "thumbnail", "playlist", "aiDisclosure",
    "allowAutomaticPlaces",
)
SHARED_FILES = (
    "TabShow-English.srt",
    "TabShow-English.vtt",
    "YouTube-Description.txt",
    "YouTube-Tags.txt",
    "TabShow-YouTube-Poster-1920x1080.png",
    "TabShow-YouTube-Thumbnail-1280x720.jpg",
)


def main():
    video = OUTPUT / VIDEO
    publication_path = HERE / PUBLICATION_FILE
    guide = HERE / "UPBEAT-AMBIENT.md"
    source_metadata_path = OUTPUT / "YouTube-Metadata.json"
    source_transcript_path = OUTPUT / "TabShow-Transcript.txt"
    required = [video, publication_path, guide, source_metadata_path,
                source_transcript_path, *(OUTPUT / name for name in SHARED_FILES)]
    missing = [str(path.relative_to(HERE)) for path in required if not path.is_file()]
    if missing:
        raise SystemExit("Cannot package this edition; missing: " + ", ".join(missing))
    if video.stat().st_size == 0:
        raise SystemExit("The upbeat ambient video is empty.")

    original = json.loads(source_metadata_path.read_text(encoding="utf-8"))
    publication = json.loads(publication_path.read_text(encoding="utf-8"))
    if not isinstance(publication, dict):
        raise SystemExit("The upbeat ambient publication record must be a JSON object.")
    if publication.get("youtubeVideoId") == "gfOky71v2wI" or any(
        "gfOky71v2wI" in str(publication.get(key, ""))
        for key in ("youtubeUrl", "studioUrl")
    ):
        raise SystemExit("The new edition cannot use the original Chrome Web Store video ID.")

    digest = hashlib.sha256()
    with video.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    video_hash = digest.hexdigest()
    expected_hash = publication.get("videoSha256")
    if expected_hash and expected_hash != video_hash:
        raise SystemExit("The new video does not match its publication videoSha256.")

    metadata = {key: original[key] for key in REUSABLE_FIELDS if key in original}
    metadata["publishStatus"] = "not_uploaded"
    metadata.update(publication)
    metadata.update({
        "title": TITLE,
        "revision": "upbeat-ambient-v3",
        "videoFile": VIDEO,
        "videoSha256": video_hash,
        "titleFile": TITLE_FILE,
        "transcriptFile": TRANSCRIPT_FILE,
        "publicationFile": PUBLICATION_FILE,
    })
    transcript = source_transcript_path.read_text(encoding="utf-8")
    _, separator, transcript_body = transcript.partition("\n")
    if not separator:
        raise SystemExit("The original transcript has no body to reuse.")

    (OUTPUT / TITLE_FILE).write_text(TITLE + "\n", encoding="utf-8")
    (OUTPUT / TRANSCRIPT_FILE).write_text(TITLE + "\n" + transcript_body, encoding="utf-8")
    (OUTPUT / METADATA_FILE).write_text(
        json.dumps(metadata, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    files = [OUTPUT / name for name in (
        VIDEO, TITLE_FILE, METADATA_FILE, TRANSCRIPT_FILE, *SHARED_FILES
    )] + [guide, publication_path]
    temporary_archive = ARCHIVE.with_suffix(".zip.tmp")
    try:
        with ZipFile(temporary_archive, "w", compression=ZIP_DEFLATED) as archive:
            for path in files:
                archive.write(path, arcname=path.name)
        with ZipFile(temporary_archive) as archive:
            corrupt = archive.testzip()
            if corrupt:
                raise RuntimeError(f"Archive integrity check failed: {corrupt}")
        temporary_archive.replace(ARCHIVE)
    finally:
        temporary_archive.unlink(missing_ok=True)

    print(json.dumps({
        "archive": str(ARCHIVE),
        "files": len(files),
        "videoSha256": video_hash,
        "publishStatus": metadata["publishStatus"],
        "title": TITLE,
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
