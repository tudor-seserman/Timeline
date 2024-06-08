module "terraform-testing" {
  source                            = "cullancarey/static-s3-website-template/aws"
  version                           = "1.2.1"
  root_domain_name                  = "aws"
  website-bucket-region             = "us-east-1"
  backup-website-bucket-region      = "us-west-1"
  cloudfront_viewer_protocol_policy = "redirect-to-https"
}