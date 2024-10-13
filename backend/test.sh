#!/bin/bash

# This script is used to test the email analysis pipeline locally.

spam_dir="spam_eml"
ham_dir="ham_eml"
output_file="stats.txt"

spam_count=0
spam_total=0
ham_count=0
ham_total=0
spam_duration=0
ham_duration=0

for file in "$ham_dir"/*; do
    echo "Analyzing ham file: $file"
    start=$(date +%s)
    output= curl -s -X POST -G http://127.0.0.1:8000/analyze/ -d "eml=$file" | jq -r '.is_phishing'
    end=$(date +%s)
    ham_duration=$((ham_duration + end - start))
    ham_total=$((ham_total + 1))

    if [ "$output" == "false" ]; then
        ham_count=$((ham_count + 1))
    fi
done

for file in "$spam_dir"/*; do
    echo "Analyzing spam file: $file"
    start=$(date +%s)
    output= curl -s -X POST -G http://127.0.0.1:8000/analyze-local/ -d "path=$file" | jq -r '.is_phishing'
    end=$(date +%s)
    spam_duration=$((spam_duration + end - start))
    spam_total=$((spam_total + 1))

    if [ "$output" == "true" ]; then
        spam_count=$((spam_count + 1))
    fi
done

echo "=====Experiment statistics=====" >"$output_file"
echo "Average spam duration: $((spam_duration / spam_count)) seconds" >>"$output_file"
echo "Average ham duration: $((ham_duration / ham_count)) seconds" >>"$output_file"
echo "Spam accuracy: $((spam_count * 100 / spam_total))%" >>"$output_file"
echo "Ham accuracy: $((ham_count * 100 / ham_total))%" >>"$output_file"
